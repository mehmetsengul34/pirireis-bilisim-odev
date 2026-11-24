import os
import secrets
import threading
import time
from collections import defaultdict, deque
from datetime import datetime, timedelta
from typing import Optional
import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User

# GÜVENLİK: JWT imzalama anahtarı yalnızca ortam değişkeninden okunur.
# Tanımlı değilse her açılışta rastgele bir anahtar üretilir (sunucu yeniden
# başladığında oturumlar düşer). Kalıcı olması için SECRET_KEY tanımlayın.
SECRET_KEY = os.getenv("SECRET_KEY", "").strip()
if not SECRET_KEY:
    SECRET_KEY = secrets.token_urlsafe(48)
    print(
        "[GÜVENLİK UYARISI] SECRET_KEY ortam değişkeni tanımlı değil. "
        "Geçici rastgele anahtar kullanılıyor; sunucu yeniden başlayınca tüm oturumlar kapanır."
    )
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

# ---------------------------------------------------------------------------
# Basit kaba kuvvet (brute-force) koruması: aynı IP + kullanıcı adı için
# belirli süre içinde çok fazla hatalı giriş denemesi engellenir.
# ---------------------------------------------------------------------------
LOGIN_MAX_ATTEMPTS = int(os.getenv("LOGIN_MAX_ATTEMPTS", "10"))
LOGIN_WINDOW_SECONDS = int(os.getenv("LOGIN_WINDOW_SECONDS", "600"))
_login_failures: dict = defaultdict(deque)
_login_lock = threading.Lock()


def _prune(attempts: deque, now: float) -> None:
    while attempts and now - attempts[0] > LOGIN_WINDOW_SECONDS:
        attempts.popleft()


def check_login_rate_limit(key: str) -> None:
    now = time.time()
    with _login_lock:
        attempts = _login_failures[key]
        _prune(attempts, now)
        if len(attempts) >= LOGIN_MAX_ATTEMPTS:
            wait_min = int((attempts[0] + LOGIN_WINDOW_SECONDS - now) / 60) + 1
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Çok fazla hatalı giriş denemesi. Lütfen {wait_min} dakika sonra tekrar deneyin.",
            )


def record_login_failure(key: str) -> None:
    with _login_lock:
        attempts = _login_failures[key]
        _prune(attempts, time.time())
        attempts.append(time.time())


def clear_login_failures(key: str) -> None:
    with _login_lock:
        _login_failures.pop(key, None)


def is_admin(user: User) -> bool:
    return bool(user) and user.role == "teacher" and (user.username or "").lower() == "pirireis"


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Geçersiz veya süresi dolmuş oturum.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user

def require_teacher(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "teacher":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu işlem yalnızca öğretmenler içindir."
        )
    return current_user

def require_student(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu işlem yalnızca öğrenciler içindir."
        )
    return current_user

def require_admin_teacher(current_user: User = Depends(require_teacher)) -> User:
    if current_user.username.lower() != "pirireis":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu işlem yalnızca yönetici öğretmen (pirireis) yetkisindedir."
        )
    return current_user
