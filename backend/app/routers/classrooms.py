import io
import re
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
import pypdf

from app.database import get_db
from app.models import User, Classroom, ClassroomStudent, Assignment, Submission
from app.schemas import ClassroomCreate, ClassroomOut, CreateStudentRequest, UserOut
from app.auth import get_current_user, require_teacher, hash_password

router = APIRouter(prefix="/api/classrooms", tags=["classrooms"])

def normalize_tr(text: str) -> str:
    tr_map = str.maketrans("çğıöşüÇĞİÖŞÜ", "cgiosuCGIOSU")
    return text.translate(tr_map).lower()

def generate_student_username(student_number: str, full_name: str) -> str:
    clean_num = str(student_number).strip()
    name_parts = full_name.strip().split()
    if len(name_parts) >= 2:
        first_names = "".join(name_parts[:-1]) # everything except surname
    elif len(name_parts) == 1:
        first_names = name_parts[0]
    else:
        first_names = "ogrenci"
    first_clean = re.sub(r'[^a-zA-Z0-9]', '', normalize_tr(first_names))
    return f"{clean_num}{first_clean}"

def parse_students_from_pdf(pdf_bytes: bytes) -> List[dict]:
    reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
    students = []
    seen_numbers = set()

    ignore_phrases = [
        "milli egitim", "bakanligi", "sinif listesi", "sube listesi",
        "ogrenci no", "adi soyadi", "cinsiyet", "imza", "sayfa",
        "ogretim yili", "ders", "ogretmen", "t.c.", "torbali", "mesleki",
        "anadolu lisesi", "toplam", "okul no"
    ]

    for page in reader.pages:
        text = page.extract_text() or ""
        lines = text.split("\n")

        for line in lines:
            line_str = line.strip()
            if not line_str:
                continue

            lower_line = normalize_tr(line_str)
            if any(phrase in lower_line for phrase in ignore_phrases) and not re.search(r'\b\d{1,6}\b', line_str):
                continue

            # Remove 11-digit TC Kimlik if present
            line_str = re.sub(r'\b\d{11}\b', ' ', line_str)

            # Match Pattern 1: Optional row number, School No (1-6 digits), Name, optional gender (K/E)
            m = re.search(
                r'(?:^\s*\d{1,3}\s+)?(\b\d{1,6}\b)\s*[-–.]?\s*([A-Za-zÇĞİÖŞÜçğıöşü\s\'.]+?)(?:\s+[EKek])?$',
                line_str.strip()
            )

            # Match Pattern 2: Name first, then School No at the end
            if not m:
                m2 = re.search(
                    r'(?:^\s*\d{1,3}\s+)?([A-Za-zÇĞİÖŞÜçğıöşü\s\'.]+?)\s*[-–.]?\s*(\b\d{1,6}\b)(?:\s+[EKek])?$',
                    line_str.strip()
                )
                if m2:
                    name_cand = m2.group(1).strip()
                    num_cand = m2.group(2).strip()
                    if len(name_cand.split()) >= 2:
                        num = num_cand
                        name = name_cand
                        m = True
                else:
                    m = None

            if m and not isinstance(m, bool):
                num = m.group(1).strip()
                name = m.group(2).strip()
            elif isinstance(m, bool) and m:
                pass
            else:
                continue

            name = re.sub(r'[\d_]', '', name).strip()
            name_parts = name.split()

            if len(name_parts) >= 2 and len(name) >= 3 and num not in seen_numbers:
                if any(w in normalize_tr(name) for w in ["mudur", "ogretmen", "imza", "tarih", "toplam"]):
                    continue

                seen_numbers.add(num)
                # Proper Turkish title case formatting
                formatted_parts = []
                for p in name_parts:
                    p_lower = p.lower()
                    formatted_parts.append(p.title() if p.isupper() else p.capitalize())
                full_name_clean = " ".join(formatted_parts)

                uname = generate_student_username(num, full_name_clean)
                students.append({
                    "student_number": num,
                    "full_name": full_name_clean,
                    "username": uname,
                    "password": "1234"
                })

    return students

@router.get("", response_model=List[ClassroomOut])
def list_classrooms(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == "teacher":
        if current_user.username.lower() == "pirireis":
            # Master teacher sees all classrooms in the system
            classes = db.query(Classroom).order_by(Classroom.created_at.desc()).all()
        else:
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
    # Master teacher or class owner can add students
    if teacher.username.lower() == "pirireis":
        classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    else:
        classroom = db.query(Classroom).filter(Classroom.id == classroom_id, Classroom.teacher_id == teacher.id).first()

    if not classroom:
        raise HTTPException(status_code=404, detail="Sınıf bulunamadı veya bu sınıfa yetkiniz yok.")

    clean_username = request.username.strip().lower()
    existing_user = db.query(User).filter(User.username == clean_username).first()

    if existing_user:
        if existing_user.role != "student":
            raise HTTPException(status_code=400, detail="Bu kullanıcı adı bir öğretmene ait.")
        student = existing_user
        if request.student_number:
            student.student_number = request.student_number.strip()
        if request.full_name:
            student.full_name = request.full_name.strip()
        db.commit()
    else:
        # Create new student account
        student = User(
            username=clean_username,
            password_hash=hash_password(request.password.strip() if request.password else "1234"),
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

@router.post("/{classroom_id}/students/upload-pdf")
async def upload_students_pdf(
    classroom_id: int,
    file: UploadFile = File(...),
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    # Check permissions
    if teacher.username.lower() == "pirireis":
        classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    else:
        classroom = db.query(Classroom).filter(Classroom.id == classroom_id, Classroom.teacher_id == teacher.id).first()

    if not classroom:
        raise HTTPException(status_code=404, detail="Sınıf bulunamadı veya bu sınıfa yetkiniz yok.")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Lütfen geçerli bir .pdf dosyası yükleyiniz.")

    try:
        content = await file.read()
        parsed_students = parse_students_from_pdf(content)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF dosyası okunurken hata oluştu: {str(e)}")

    if not parsed_students:
        raise HTTPException(
            status_code=400,
            detail="PDF dosyasından öğrenci listesi tespit edilemedi. Lütfen e-Okul sınıf listesi formatında bir PDF yüklediğinizden emin olunuz."
        )

    added_students = []
    already_enrolled_count = 0

    for st in parsed_students:
        uname = st["username"]
        num = st["student_number"]
        fname = st["full_name"]

        # Check existing user
        user = db.query(User).filter(User.username == uname).first()
        if not user:
            # Create student user with standard password 1234
            user = User(
                username=uname,
                password_hash=hash_password("1234"),
                full_name=fname,
                student_number=num,
                role="student"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Update student info if needed
            if not user.student_number:
                user.student_number = num
            user.full_name = fname
            db.commit()

        # Check classroom enrollment
        enrollment = db.query(ClassroomStudent).filter(
            ClassroomStudent.classroom_id == classroom_id,
            ClassroomStudent.student_id == user.id
        ).first()

        if not enrollment:
            new_enr = ClassroomStudent(
                classroom_id=classroom_id,
                student_id=user.id
            )
            db.add(new_enr)
            db.commit()
            added_students.append({
                "id": user.id,
                "full_name": user.full_name,
                "student_number": user.student_number,
                "username": user.username,
                "password": "1234",
                "status": "Eklendi"
            })
        else:
            already_enrolled_count += 1
            added_students.append({
                "id": user.id,
                "full_name": user.full_name,
                "student_number": user.student_number,
                "username": user.username,
                "password": "1234",
                "status": "Zaten Kayıtlı"
            })

    return {
        "message": f"PDF başarıyla işlendi: {len(added_students)} öğrenci listelendi ({already_enrolled_count} zaten kayıtlıydı).",
        "total_parsed": len(parsed_students),
        "newly_added": len(added_students) - already_enrolled_count,
        "students": added_students
    }

@router.delete("/{classroom_id}/students/{student_id}")
def remove_student_from_classroom(
    classroom_id: int,
    student_id: int,
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    if teacher.username.lower() == "pirireis":
        classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    else:
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
    if teacher.username.lower() == "pirireis":
        classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    else:
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
