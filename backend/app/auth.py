from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Classroom, Assignment, Submission, ClassroomStudent
from app.schemas import (
    LoginRequest, TokenResponse, UserOut,
    ChangePasswordRequest, CreateTeacherRequest
)
from app.auth import (
    verify_password, hash_password, create_access_token,
    get_current_user, require_admin_teacher,
    check_login_rate_limit, record_login_failure, clear_login_failures
)

MIN_PASSWORD_LENGTH = 6


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "bilinmiyor"

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, http_request: Request, db: Session = Depends(get_db)):
    username = request.username.strip().lower()
    rate_key = f"{_client_ip(http_request)}|{username}"
    check_login_rate_limit(rate_key)

    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(request.password, user.password_hash):
        record_login_failure(rate_key)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Kullanıcı adı veya şifre hatalı!"
        )
    clear_login_failures(rate_key)

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(request.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mevcut şifreniz hatalı!"
        )

    new_pwd = request.new_password.strip()
    if len(new_pwd) < MIN_PASSWORD_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Yeni şifreniz en az {MIN_PASSWORD_LENGTH} karakter olmalıdır."
        )
    if new_pwd == request.current_password.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Yeni şifreniz mevcut şifrenizle aynı olamaz."
        )

    current_user.password_hash = hash_password(new_pwd)
    # GÜVENLİK: Kullanıcının kendi belirlediği şifre açık metin olarak saklanmaz.
    # Öğretmen panelinde "öğrenci özel şifre belirlemiş" olarak görünür;
    # gerekirse öğretmen şifreyi sıfırlayabilir.
    current_user.plain_password = None
    db.commit()
    return {"message": "Şifreniz başarıyla değiştirildi."}

@router.get("/teachers", response_model=List[UserOut])
def list_teachers(
    admin: User = Depends(require_admin_teacher),
    db: Session = Depends(get_db)
):
    teachers = db.query(User).filter(User.role == "teacher").order_by(User.id.asc()).all()
    return teachers

@router.post("/teachers", response_model=UserOut)
def create_teacher(
    request: CreateTeacherRequest,
    admin: User = Depends(require_admin_teacher),
    db: Session = Depends(get_db)
):
    username = request.username.strip().lower()
    if not username or not request.password or not request.full_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tüm alanları doldurmanız gerekmektedir."
        )
    if len(request.password.strip()) < MIN_PASSWORD_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Öğretmen şifresi en az {MIN_PASSWORD_LENGTH} karakter olmalıdır."
        )

    existing = db.query(User).filter(User.username == username).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{username}' kullanıcı adı zaten kullanımda."
        )

    new_teacher = User(
        username=username,
        password_hash=hash_password(request.password.strip()),
        full_name=request.full_name.strip(),
        role="teacher"
    )
    db.add(new_teacher)
    db.commit()
    db.refresh(new_teacher)
    return new_teacher

@router.delete("/teachers/{teacher_id}")
def delete_teacher(
    teacher_id: int,
    admin: User = Depends(require_admin_teacher),
    db: Session = Depends(get_db)
):
    teacher = db.query(User).filter(User.id == teacher_id, User.role == "teacher").first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Öğretmen bulunamadı.")

    if teacher.username.lower() == "pirireis":
        raise HTTPException(status_code=400, detail="Ana yönetici hesabı (pirireis) silinemez.")

    # Clean teacher's classrooms and assignments
    classrooms = db.query(Classroom).filter(Classroom.teacher_id == teacher.id).all()
    for c in classrooms:
        assignments = db.query(Assignment).filter(Assignment.classroom_id == c.id).all()
        for a in assignments:
            db.query(Submission).filter(Submission.assignment_id == a.id).delete(synchronize_session=False)
            db.delete(a)
        db.query(ClassroomStudent).filter(ClassroomStudent.classroom_id == c.id).delete(synchronize_session=False)
        db.delete(c)

    teacher_name = teacher.full_name
    db.delete(teacher)
    db.commit()
    return {"message": f"'{teacher_name}' öğretmen hesabı başarıyla silindi."}
