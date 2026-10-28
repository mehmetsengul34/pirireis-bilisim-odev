import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Response
from sqlalchemy.orm import Session

from app.database import get_db, get_db_info
from app.models import User, Classroom, ClassroomStudent, Assignment, Submission
from app.auth import require_admin_teacher

router = APIRouter(prefix="/api/system", tags=["system"])

@router.get("/status")
def get_system_status(
    admin: User = Depends(require_admin_teacher),
    db: Session = Depends(get_db)
):
    db_info = get_db_info()
    teacher_count = db.query(User).filter(User.role == "teacher").count()
    student_count = db.query(User).filter(User.role == "student").count()
    classroom_count = db.query(Classroom).count()
    assignment_count = db.query(Assignment).count()
    submission_count = db.query(Submission).count()

    return {
        "db": db_info,
        "counts": {
            "teachers": teacher_count,
            "students": student_count,
            "classrooms": classroom_count,
            "assignments": assignment_count,
            "submissions": submission_count
        },
        "server_time": datetime.utcnow().isoformat()
    }

@router.get("/backup")
def export_backup(
    admin: User = Depends(require_admin_teacher),
    db: Session = Depends(get_db)
):
    users = db.query(User).all()
    classrooms = db.query(Classroom).all()
    classroom_students = db.query(ClassroomStudent).all()
    assignments = db.query(Assignment).all()
    submissions = db.query(Submission).all()

    backup_data = {
        "meta": {
            "version": "1.0",
            "school": "Torbalı Piri Reis MTAL Bilişim Alanı",
            "exported_at": datetime.utcnow().isoformat(),
            "exported_by": admin.username
        },
        "users": [
            {
                "id": u.id,
                "username": u.username,
                "password_hash": u.password_hash,
                "full_name": u.full_name,
                "role": u.role,
                "student_number": u.student_number,
                "created_at": u.created_at.isoformat() if u.created_at else None
            }
            for u in users
        ],
        "classrooms": [
            {
                "id": c.id,
                "name": c.name,
                "grade_level": c.grade_level,
                "description": c.description,
                "teacher_id": c.teacher_id,
                "created_at": c.created_at.isoformat() if c.created_at else None
            }
            for c in classrooms
        ],
        "classroom_students": [
            {
                "classroom_id": cs.classroom_id,
                "student_id": cs.student_id,
                "joined_at": cs.joined_at.isoformat() if cs.joined_at else None
            }
            for cs in classroom_students
        ],
        "assignments": [
            {
                "id": a.id,
                "classroom_id": a.classroom_id,
                "teacher_id": a.teacher_id,
                "title": a.title,
                "description": a.description,
                "due_date": a.due_date.isoformat() if a.due_date else None,
                "attachment_path": a.attachment_path,
                "attachment_filename": a.attachment_filename,
                "created_at": a.created_at.isoformat() if a.created_at else None
            }
            for a in assignments
        ],
        "submissions": [
            {
                "id": s.id,
                "assignment_id": s.assignment_id,
                "student_id": s.student_id,
                "file_path": s.file_path,
                "file_name": s.file_name,
                "student_note": s.student_note,
                "grade": s.grade,
                "feedback": s.feedback,
                "submitted_at": s.submitted_at.isoformat() if s.submitted_at else None,
                "graded_at": s.graded_at.isoformat() if s.graded_at else None
            }
            for s in submissions
        ]
    }

    content = json.dumps(backup_data, ensure_ascii=False, indent=2)
    filename = f"pirireis_lms_backup_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"

    return Response(
        content=content,
        media_type="application/json",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )

@router.post("/restore")
async def restore_backup(
    file: UploadFile = File(...),
    admin: User = Depends(require_admin_teacher),
    db: Session = Depends(get_db)
):
    try:
        content = await file.read()
        data = json.loads(content.decode("utf-8"))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Geçersiz JSON yedek dosyası: {str(e)}")

    if "users" not in data or "classrooms" not in data:
        raise HTTPException(status_code=400, detail="Yedek dosya formatı uyumsuz (kullanıcı veya sınıf verisi eksik).")

    user_id_map = {}
    restored_users = 0
    updated_users = 0

    # 1. Restore Users
    for u in data.get("users", []):
        old_id = u["id"]
        uname = u["username"].strip().lower()
        existing = db.query(User).filter(User.username == uname).first()

        if existing:
            user_id_map[old_id] = existing.id
            # Update password or full_name if needed
            existing.full_name = u.get("full_name", existing.full_name)
            existing.role = u.get("role", existing.role)
            existing.student_number = u.get("student_number", existing.student_number)
            if u.get("password_hash") and uname != "pirireis":
                existing.password_hash = u["password_hash"]
            updated_users += 1
        else:
            new_u = User(
                username=uname,
                password_hash=u["password_hash"],
                full_name=u.get("full_name", uname),
                role=u.get("role", "student"),
                student_number=u.get("student_number")
            )
            db.add(new_u)
            db.commit()
            db.refresh(new_u)
            user_id_map[old_id] = new_u.id
            restored_users += 1

    db.commit()

    # 2. Restore Classrooms
    classroom_id_map = {}
    restored_classes = 0

    for c in data.get("classrooms", []):
        old_cid = c["id"]
        teacher_id = user_id_map.get(c.get("teacher_id"), admin.id)
        c_name = c["name"].strip()

        # Check if classroom with same name and teacher exists
        existing_class = db.query(Classroom).filter(
            Classroom.name == c_name,
            Classroom.teacher_id == teacher_id
        ).first()

        if not existing_class:
            # Fallback check by name only
            existing_class = db.query(Classroom).filter(Classroom.name == c_name).first()

        if existing_class:
            classroom_id_map[old_cid] = existing_class.id
        else:
            new_c = Classroom(
                name=c_name,
                grade_level=c.get("grade_level", "11. Sınıf"),
                description=c.get("description", ""),
                teacher_id=teacher_id
            )
            db.add(new_c)
            db.commit()
            db.refresh(new_c)
            classroom_id_map[old_cid] = new_c.id
            restored_classes += 1

    db.commit()

    # 3. Restore Classroom Students Enrollments
    restored_enrollments = 0
    for cs in data.get("classroom_students", []):
        new_cid = classroom_id_map.get(cs["classroom_id"])
        new_sid = user_id_map.get(cs["student_id"])

        if new_cid and new_sid:
            exists = db.query(ClassroomStudent).filter(
                ClassroomStudent.classroom_id == new_cid,
                ClassroomStudent.student_id == new_sid
            ).first()
            if not exists:
                enroll = ClassroomStudent(classroom_id=new_cid, student_id=new_sid)
                db.add(enroll)
                restored_enrollments += 1

    db.commit()

    # 4. Restore Assignments
    assignment_id_map = {}
    restored_assignments = 0
    for a in data.get("assignments", []):
        old_aid = a["id"]
        new_cid = classroom_id_map.get(a["classroom_id"])
        new_tid = user_id_map.get(a["teacher_id"], admin.id)

        if not new_cid:
            continue

        existing_a = db.query(Assignment).filter(
            Assignment.classroom_id == new_cid,
            Assignment.title == a["title"]
        ).first()

        if existing_a:
            assignment_id_map[old_aid] = existing_a.id
        else:
            due = None
            if a.get("due_date"):
                try:
                    due = datetime.fromisoformat(a["due_date"].replace("Z", "+00:00"))
                except Exception:
                    try:
                        due = datetime.strptime(a["due_date"][:19], "%Y-%m-%dT%H:%M:%S")
                    except Exception:
                        due = None
            new_a = Assignment(
                classroom_id=new_cid,
                teacher_id=new_tid,
                title=a["title"],
                description=a.get("description"),
                due_date=due,
                attachment_path=a.get("attachment_path"),
                attachment_filename=a.get("attachment_filename")
            )
            db.add(new_a)
            db.commit()
            db.refresh(new_a)
            assignment_id_map[old_aid] = new_a.id
            restored_assignments += 1

    db.commit()

    # 5. Restore Submissions
    restored_submissions = 0
    for s in data.get("submissions", []):
        new_aid = assignment_id_map.get(s["assignment_id"])
        new_sid = user_id_map.get(s["student_id"])

        if new_aid and new_sid:
            exists = db.query(Submission).filter(
                Submission.assignment_id == new_aid,
                Submission.student_id == new_sid
            ).first()
            if not exists:
                new_sub = Submission(
                    assignment_id=new_aid,
                    student_id=new_sid,
                    file_path=s.get("file_path"),
                    file_name=s.get("file_name"),
                    student_note=s.get("student_note"),
                    grade=s.get("grade"),
                    feedback=s.get("feedback")
                )
                db.add(new_sub)
                restored_submissions += 1

    db.commit()

    return {
        "message": "Yedek başarıyla geri yüklendi!",
        "stats": {
            "new_users": restored_users,
            "updated_users": updated_users,
            "new_classrooms": restored_classes,
            "new_enrollments": restored_enrollments,
            "new_assignments": restored_assignments,
            "new_submissions": restored_submissions
        }
    }
