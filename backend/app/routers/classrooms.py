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

def clean_tr_name(name: str) -> str:
    parts = name.strip().split()
    formatted = []
    for p in parts:
        p = p.strip(".,-_")
        if not p:
            continue
        first = p[0].replace('i', 'İ').replace('ı', 'I').upper()
        rest = p[1:].replace('I', 'ı').replace('İ', 'i').lower()
        formatted.append(first + rest)
    return " ".join(formatted)

def generate_student_username(student_number: str, first_name: str) -> str:
    clean_num = str(student_number).strip()
    first_clean = re.sub(r'[^a-zA-Z0-9]', '', normalize_tr(first_name))
    if not first_clean:
        first_clean = "ogrenci"
    return f"{clean_num}{first_clean}"

def parse_students_from_pdf(pdf_bytes: bytes) -> List[dict]:
    reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
    all_lines = []
    for page in reader.pages:
        text = page.extract_text() or ""
        for line in text.splitlines():
            l_str = line.strip()
            if l_str:
                all_lines.append(l_str)

    students = []
    seen_numbers = set()
    idx = 0
    footer_keywords = ["mudur", "ogretmen", "imza", "tarih", "toplam", "sayfa", "sube listesi", "sinif listesi"]

    while idx < len(all_lines):
        line = all_lines[idx]
        clean_line = re.sub(r'[|\t]+', ' ', line).strip()

        # 1. Check Horizontal single-line pattern: e.g. "1 101 Ahmet Yılmaz E" or "101 Ahmet Yılmaz"
        m = re.match(
            r'^(?:(\d{1,4})\s+)?(\d{1,8})\s+([A-Za-zÇĞİÖŞÜçğıöşü\s\'.]+?)\s+([A-Za-zÇĞİÖŞÜçğıöşü]+)(?:\s+[EKek])?$',
            clean_line
        )
        if m:
            num = m.group(2).strip()
            fn = m.group(3).strip()
            sn = m.group(4).strip()
            norm_fn = normalize_tr(fn)
            if num not in seen_numbers and len(fn) >= 2 and not any(k in norm_fn for k in footer_keywords):
                seen_numbers.add(num)
                students.append({
                    "student_number": num,
                    "full_name": clean_tr_name(f"{fn} {sn}"),
                    "username": generate_student_username(num, fn),
                    "password": "1234"
                })
            idx += 1
            continue

        # 2. Check Vertical Pattern with S.No: all_lines[idx] is S.No (int), all_lines[idx+1] is Okul No (int)
        if all_lines[idx].isdigit() and idx + 1 < len(all_lines) and all_lines[idx+1].isdigit():
            sno_cand = all_lines[idx]
            num_cand = all_lines[idx+1]
            if len(num_cand) <= 8:
                k = idx + 2
                name_tokens = []
                while k < len(all_lines):
                    tk = all_lines[k].strip()
                    norm_tk = normalize_tr(tk)
                    if any(f in norm_tk for f in footer_keywords):
                        break
                    if tk.isdigit():
                        break
                    name_tokens.append(tk)
                    k += 1

                if len(name_tokens) >= 2:
                    # Check if last token is gender
                    last_upper = name_tokens[-1].upper()
                    if last_upper in ["E", "K", "KIZ", "ERKEK"] or (len(name_tokens[-1]) == 1 and not name_tokens[-1].isdigit()):
                        name_tokens.pop()

                    if len(name_tokens) >= 2:
                        fn = " ".join(name_tokens[:-1])
                        sn = name_tokens[-1]
                    elif len(name_tokens) == 1:
                        fn = name_tokens[0]
                        sn = ""
                    else:
                        fn = ""
                        sn = ""

                    norm_fn = normalize_tr(fn)
                    if num_cand not in seen_numbers and len(fn) >= 2 and not any(k in norm_fn for k in footer_keywords):
                        seen_numbers.add(num_cand)
                        students.append({
                            "student_number": num_cand,
                            "full_name": clean_tr_name(f"{fn} {sn}"),
                            "username": generate_student_username(num_cand, fn),
                            "password": "1234"
                        })
                    idx = k
                    continue

        # 3. Check Vertical Pattern without S.No: all_lines[idx] is Okul No (int), followed by non-digits
        if all_lines[idx].isdigit() and len(all_lines[idx]) <= 8:
            num_cand = all_lines[idx]
            k = idx + 1
            name_tokens = []
            while k < len(all_lines):
                tk = all_lines[k].strip()
                norm_tk = normalize_tr(tk)
                if any(f in norm_tk for f in footer_keywords):
                    break
                if tk.isdigit():
                    break
                name_tokens.append(tk)
                k += 1

            if len(name_tokens) >= 2:
                last_upper = name_tokens[-1].upper()
                if last_upper in ["E", "K", "KIZ", "ERKEK"] or (len(name_tokens[-1]) == 1 and not name_tokens[-1].isdigit()):
                    name_tokens.pop()

                if len(name_tokens) >= 2:
                    fn = " ".join(name_tokens[:-1])
                    sn = name_tokens[-1]
                else:
                    fn = name_tokens[0]
                    sn = ""

                norm_fn = normalize_tr(fn)
                if num_cand not in seen_numbers and len(fn) >= 2 and not any(k in norm_fn for k in footer_keywords):
                    seen_numbers.add(num_cand)
                    students.append({
                        "student_number": num_cand,
                        "full_name": clean_tr_name(f"{fn} {sn}"),
                        "username": generate_student_username(num_cand, fn),
                        "password": "1234"
                    })
                idx = k
                continue

        idx += 1

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

        # Check existing student: first by student_number, then by username
        user = None
        if num:
            user = db.query(User).filter(User.student_number == num, User.role == "student").first()
        if not user:
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
            # Update student info and keep standard format
            if not user.student_number:
                user.student_number = num
            user.full_name = fname
            if user.username != uname:
                existing_uname_user = db.query(User).filter(User.username == uname).first()
                if not existing_uname_user:
                    user.username = uname
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
