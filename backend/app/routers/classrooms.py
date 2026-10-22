from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Classroom, ClassroomStudent, Assignment, Submission
from app.schemas import ClassroomCreate, ClassroomOut, CreateStudentRequest, UserOut
from app.auth import get_current_user, require_teacher, hash_password

router = APIRouter(prefix="/api/classrooms", tags=["classrooms"])

@router.get("", response_model=List[ClassroomOut])
def list_classrooms(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == "teacher":
        classes = db.query(Classroom).filter(Classroom.teacher_id == current_user.id).order_by(Classroom.created_at.desc()).all()
    else:
        classes = (
            db.query(Classroom)
            .join(ClassroomStudent, Classroom.id == ClassroomStudent.classroom_id)
            .filter(ClassroomStudent.student_id == current_user.id)
            .order_by(Classroom.created_at.desc())
            .all()
        )

    result = []
    for c in classes:
        student_count = db.query(ClassroomStudent).filter(ClassroomStudent.classroom_id == c.id).count()
        assignment_count = db.query(Assignment).filter(Assignment.classroom_id == c.id).count()
        result.append(ClassroomOut(
            id=c.id,
            name=c.name,
            grade_level=c.grade_level,
            description=c.description,
            teacher_id=c.teacher_id,
            created_at=c.created_at,
            student_count=student_count,
            assignment_count=assignment_count
        ))
    return result

@router.post("", response_model=ClassroomOut)
def create_classroom(
    request: ClassroomCreate,
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    classroom = Classroom(
        name=request.name.strip(),
        grade_level=request.grade_level.strip() if request.grade_level else "Bilişim Teknolojileri",
        description=request.description.strip() if request.description else "",
        teacher_id=teacher.id
    )
    db.add(classroom)
    db.commit()
    db.refresh(classroom)
    return ClassroomOut(
        id=classroom.id,
        name=classroom.name,
        grade_level=classroom.grade_level,
        description=classroom.description,
        teacher_id=classroom.teacher_id,
        created_at=classroom.created_at,
        student_count=0,
        assignment_count=0
    )

@router.get("/{classroom_id}/students", response_model=List[UserOut])
def get_classroom_students(
    classroom_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not classroom:
        raise HTTPException(status_code=404, detail="Sınıf bulunamadı.")

    students = (
        db.query(User)
        .join(ClassroomStudent, User.id == ClassroomStudent.student_id)
        .filter(ClassroomStudent.classroom_id == classroom_id)
        .order_by(User.full_name.asc())
        .all()
    )
    return students

@router.post("/{classroom_id}/students", response_model=UserOut)
def add_student_to_classroom(
    classroom_id: int,
    request: CreateStudentRequest,
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    classroom = db.query(Classroom).filter(Classroom.id == classroom_id, Classroom.teacher_id == teacher.id).first()
    if not classroom:
        raise HTTPException(status_code=404, detail="Sınıf bulunamadı veya bu sınıfa yetkiniz yok.")

    clean_username = request.username.strip().lower()
    existing_user = db.query(User).filter(User.username == clean_username).first()

    if existing_user:
        if existing_user.role != "student":
            raise HTTPException(status_code=400, detail="Bu kullanıcı adı bir öğretmene ait.")
        student = existing_user
    else:
        # Create new student account
        student = User(
            username=clean_username,
            password_hash=hash_password(request.password.strip()),
            full_name=request.full_name.strip(),
            role="student",
            student_number=request.student_number.strip() if request.student_number else None
        )
        db.add(student)
        db.commit()
        db.refresh(student)

    # Check if already enrolled in this class
    enrollment = db.query(ClassroomStudent).filter(
        ClassroomStudent.classroom_id == classroom_id,
        ClassroomStudent.student_id == student.id
    ).first()

    if not enrollment:
        new_enrollment = ClassroomStudent(
            classroom_id=classroom_id,
            student_id=student.id
        )
        db.add(new_enrollment)
        db.commit()

    return student

@router.delete("/{classroom_id}/students/{student_id}")
def remove_student_from_classroom(
    classroom_id: int,
    student_id: int,
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    classroom = db.query(Classroom).filter(Classroom.id == classroom_id, Classroom.teacher_id == teacher.id).first()
    if not classroom:
        raise HTTPException(status_code=404, detail="Sınıf bulunamadı veya yetkiniz yok.")

    enrollment = db.query(ClassroomStudent).filter(
        ClassroomStudent.classroom_id == classroom_id,
        ClassroomStudent.student_id == student_id
    ).first()

    if not enrollment:
        raise HTTPException(status_code=404, detail="Öğrenci bu sınıfta kayıtlı değil.")

    db.delete(enrollment)
    db.commit()
    return {"message": "Öğrenci sınıftan çıkarıldı."}

@router.delete("/{classroom_id}")
def delete_classroom(
    classroom_id: int,
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    classroom = db.query(Classroom).filter(
        Classroom.id == classroom_id,
        Classroom.teacher_id == teacher.id
    ).first()
    if not classroom:
        raise HTTPException(status_code=404, detail="Sınıf bulunamadı veya bu sınıfı silme yetkiniz yok.")

    class_name = classroom.name
    
    # Sınıfa ait ödevleri ve bu ödevlerin teslimatlarını temizle
    assignments = db.query(Assignment).filter(Assignment.classroom_id == classroom_id).all()
    for a in assignments:
        db.query(Submission).filter(Submission.assignment_id == a.id).delete(synchronize_session=False)
        db.delete(a)

    # Sınıfa kayıtlı öğrencilerin eşleşmelerini sil
    db.query(ClassroomStudent).filter(ClassroomStudent.classroom_id == classroom_id).delete(synchronize_session=False)

    db.delete(classroom)
    db.commit()
    return {"message": f"'{class_name}' sınıfı başarıyla silindi."}


