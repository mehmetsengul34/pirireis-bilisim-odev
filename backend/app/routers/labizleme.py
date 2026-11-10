import time
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Request, Response
from pydantic import BaseModel

router = APIRouter(prefix="/api/labizleme", tags=["labizleme"])

# In-memory classroom & student state on the cloud backend
students: Dict[str, Dict[str, Any]] = {}
arp_devices_cache: List[Dict[str, str]] = []
arp_last_updated: float = 0.0

classroom_state: Dict[str, Any] = {
    "lockAll": False,
    "lockMessage": "Öğretmen dersi anlatıyor. Lütfen ekranınıza değil öğretmeninize odaklanın.",
    "teacherStreamActive": False,
    "teacherFrame": None,
    "announcement": None,
    "openUrlCommand": None,
}


class FramePayload(BaseModel):
    id: Optional[str] = None
    deskNo: Optional[str] = None
    studentName: Optional[str] = None
    name: Optional[str] = None
    frame: Optional[str] = None
    resolution: Optional[str] = None
    handRaised: Optional[bool] = None
    localIp: Optional[str] = None
    mac: Optional[str] = None


class ActionPayload(BaseModel):
    action: str
    lock: Optional[bool] = None
    message: Optional[str] = None
    studentId: Optional[str] = None
    url: Optional[str] = None
    active: Optional[bool] = None
    frame: Optional[str] = None


class ArpSyncPayload(BaseModel):
    teacherIp: Optional[str] = None
    hostname: Optional[str] = None
    devices: List[Dict[str, str]] = []


@router.get("/state")
def get_lab_state(request: Request):
    now = time.time() * 1000.0
    for st in students.values():
        if now - st.get("lastSeen", 0) > 15000:
            st["online"] = False

    return {
        "teacherIp": "ogretmenlerodasi.info/labizleme",
        "port": 443,
        "hostname": "CLOUD-LAB-MASTER",
        "arpDevices": arp_devices_cache,
        "arpLastUpdated": arp_last_updated,
        "classroomState": {
            "lockAll": classroom_state["lockAll"],
            "lockMessage": classroom_state["lockMessage"],
            "teacherStreamActive": classroom_state["teacherStreamActive"],
            "announcement": classroom_state["announcement"],
            "openUrlCommand": classroom_state["openUrlCommand"],
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

    desk_no = payload.deskNo or existing.get("deskNo") or "PC"
    student_name = payload.studentName or existing.get("studentName") or "Öğrenci"

    now_str = time.strftime("%H:%M:%S")
    updated = {
        "id": student_id,
        "deskNo": desk_no,
        "studentName": student_name,
        "name": payload.name or f"{desk_no} ({student_name})",
        "ip": client_ip,
        "mac": payload.mac or existing.get("mac") or "",
        "frame": payload.frame if payload.frame is not None else existing.get("frame"),
        "resolution": payload.resolution or existing.get("resolution") or "",
        "handRaised": bool(payload.handRaised) if payload.handRaised is not None else bool(existing.get("handRaised", False)),
        "locked": existing.get("locked", False),
        "privateMessage": existing.get("privateMessage", None),
        "online": True,
        "firstSeen": existing.get("firstSeen") or now_str,
        "lastSeen": time.time() * 1000.0,
    }
    students[student_id] = updated

    return {
        "ok": True,
        "locked": bool(classroom_state["lockAll"] or updated["locked"]),
        "lockMessage": classroom_state["lockMessage"],
        "teacherStreamActive": classroom_state["teacherStreamActive"],
        "teacherFrame": classroom_state["teacherFrame"] if classroom_state["teacherStreamActive"] else None,
        "announcement": updated["privateMessage"] or classroom_state["announcement"],
        "openUrlCommand": classroom_state["openUrlCommand"],
    }


@router.post("/action")
def post_teacher_action(payload: ActionPayload):
    action = payload.action
    now_str = time.strftime("%H:%M:%S")

    if action == "toggleLockAll":
        classroom_state["lockAll"] = bool(payload.lock)
        if payload.message:
            classroom_state["lockMessage"] = payload.message
    elif action == "toggleLockStudent":
        if payload.studentId and payload.studentId in students:
            students[payload.studentId]["locked"] = bool(payload.lock)
    elif action == "announce":
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
        classroom_state["openUrlCommand"] = (
            {"id": str(int(time.time() * 1000)), "url": payload.url, "timestamp": int(time.time() * 1000)}
            if payload.url
            else None
        )
    elif action == "teacherScreen":
        classroom_state["teacherStreamActive"] = bool(payload.active)
        classroom_state["teacherFrame"] = payload.frame if payload.active else None
    elif action == "clearHand":
        if payload.studentId and payload.studentId in students:
            students[payload.studentId]["handRaised"] = False

    return {"ok": True, "classroomState": classroom_state}


@router.post("/arp")
def sync_local_arp(payload: ArpSyncPayload):
    global arp_devices_cache, arp_last_updated
    arp_devices_cache = payload.devices or []
    arp_last_updated = time.time() * 1000.0
    return {"ok": True, "count": len(arp_devices_cache)}


@router.get("/ogrenci-istemci.bat")
def download_student_bat():
    bat_lines = [
        "@echo off",
        "chcp 65001 >nul",
        "title Torbali Piri Reis Ticaret MTAL - Ogrenci Ekran Paylasim Istemcisi",
        "",
        'set "LIVE_URL=https://ogretmenlerodasi.info/labizleme"',
        'set "LOCAL_TEACHER=http://192.168.23.244:4000"',
        "",
        ":: Yerel IP ve MAC adresini tespit et (ogretmen panelinde dogru gorunmesi icin)",
        "for /f \"delims=\" %%A in ('powershell -NoProfile -Command \"(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like '192.168.*' -or $_.IPAddress -like '10.*' } | Select-Object -First 1).IPAddress\"') do set \"LOCAL_IP=%%A\"",
        "for /f \"delims=\" %%M in ('powershell -NoProfile -Command \"(Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | Select-Object -First 1).MacAddress\"') do set \"LOCAL_MAC=%%M\"",
        "",
        'set "APP_URL=%LIVE_URL%/ogrenci.html?pc=%COMPUTERNAME%&user=%USERNAME%&ip=%LOCAL_IP%&mac=%LOCAL_MAC%&autostart=1"',
        'set "PROFILE_DIR=%LOCALAPPDATA%\\PiriReisLabClient"',
        "",
        "echo ============================================================",
        "echo   TORBALI PIRI REIS TICARET MTAL - BILISIM LABORATUVARI",
        "echo   Canli Sunucuya Baglaniliyor (%LIVE_URL%)...",
        "echo   Bilgisayar Adi : %COMPUTERNAME%",
        "echo   Kullanici Adi  : %USERNAME%",
        "echo   Yerel IP       : %LOCAL_IP%",
        "echo ============================================================",
        "",
        ":: Masaustune kisayol olustur (ilk calistirmada)",
        'set "SHORTCUT_PATH=%USERPROFILE%\\Desktop\\Lab Ekran Paylasimi.lnk"',
        'if not exist "%SHORTCUT_PATH%" (',
        '    powershell -NoProfile -Command "$wsh = New-Object -ComObject WScript.Shell; $sc = $wsh.CreateShortcut(\'%SHORTCUT_PATH%\'); $sc.TargetPath = \'%~f0\'; $sc.WorkingDirectory = \'%~dp0\'; $sc.Description = \'Ogretmen Ekran Paylasim Istemcisi\'; $sc.Save()" >nul 2>&1',
        ")",
        "",
        ":: Chrome veya Edge yollarini kontrol et",
        'set "CHROME_EXE=%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe"',
        'set "CHROME_X86=%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe"',
        'set "CHROME_LOCAL=%LOCALAPPDATA%\\Google\\Chrome\\Application\\chrome.exe"',
        'set "EDGE_EXE=%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe"',
        'set "EDGE_X64=%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe"',
        "",
        'set "BROWSER_EXE="',
        'if exist "%CHROME_EXE%" set "BROWSER_EXE=%CHROME_EXE%"',
        'if not defined BROWSER_EXE if exist "%CHROME_X86%" set "BROWSER_EXE=%CHROME_X86%"',
        'if not defined BROWSER_EXE if exist "%CHROME_LOCAL%" set "BROWSER_EXE=%CHROME_LOCAL%"',
        'if not defined BROWSER_EXE if exist "%EDGE_EXE%" set "BROWSER_EXE=%EDGE_EXE%"',
        'if not defined BROWSER_EXE if exist "%EDGE_X64%" set "BROWSER_EXE=%EDGE_X64%"',
        "",
        'if defined BROWSER_EXE (',
        '    start "" "%BROWSER_EXE%" --user-data-dir="%PROFILE_DIR%" --no-first-run --no-default-browser-check --auto-select-desktop-capture-source="Entire screen" --enable-usermedia-screen-capturing --app="%APP_URL%"',
        "    exit /b 0",
        ")",
        "",
        'start "" "%APP_URL%"',
        "",
    ]
    content = "\r\n".join(bat_lines)
    return Response(
        content=content.encode("utf-8"),
        media_type="application/octet-stream",
        headers={"Content-Disposition": 'attachment; filename="ogrenci-istemci.bat"'},
    )
