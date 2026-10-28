import os
import uuid
import aiofiles
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from app.database import get_db, BASE_DIR
from app.models import User, Classroom, ClassroomStudent, Assignment, Submission
from app.schemas import AssignmentOut, SubmissionOut
from app.auth import get_current_user, require_teacher

router = APIRouter(prefix="/api/assignments", tags=["assignments"])

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads", "assignments")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("", response_model=List[AssignmentOut])
def list_assignments(
    classroom_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Assignment)

    if current_user.role == "teacher":
        if current_user.username.lower() != "pirireis":
            teacher_class_ids = [
                row[0] for row in db.query(Classroom.id).filter(Classroom.teacher_id == current_user.id).all()
            ]
            query = query.filter(
                (Assignment.teacher_id == current_user.id) | (Assignment.classroom_id.in_(teacher_class_ids))
            )
        if classroom_id:
            query = query.filter(Assignment.classroom_id == classroom_id)
    else:
        # Student: get classes student is enrolled in
        student_class_ids = [
            row[0] for row in db.query(ClassroomStudent.classroom_id).filter(
                ClassroomStudent.student_id == current_user.id
            ).all()
        ]
        if not student_class_ids:
            return []
        query = query.filter(Assignment.classroom_id.in_(student_class_ids))
        if classroom_id:
            query = query.filter(Assignment.classroom_id == classroom_id)

    assignments = query.order_by(Assignment.created_at.desc()).all()

    result = []
    for a in assignments:
        sub_count = db.query(Submission).filter(Submission.assignment_id == a.id).count()
        graded_count = db.query(Submission).filter(
            Submission.assignment_id == a.id,
            Submission.grade.isnot(None)
        ).count()

        my_submission_out = None
        if current_user.role == "student":
            sub = db.query(Submission).filter(
                Submission.assignment_id == a.id,
                Submission.student_id == current_user.id
            ).first()
            if sub:
                my_submission_out = SubmissionOut(
                    id=sub.id,
                    assignment_id=sub.assignment_id,
                    student_id=sub.student_id,
                    file_path=sub.file_path,
                    file_name=sub.file_name,
                    student_note=sub.student_note,
                    submitted_at=sub.submitted_at,
                    grade=sub.grade,
                    feedback=sub.feedback,
                    graded_at=sub.graded_at
                )

        result.append(AssignmentOut(
            id=a.id,
            classroom_id=a.classroom_id,
            classroom_name=a.classroom.name if a.classroom else "Bilinmeyen Sınıf",
            title=a.title,
            description=a.description,
            due_date=a.due_date,
            attachment_path=a.attachment_path,
            attachment_filename=a.attachment_filename,
            created_at=a.created_at,
            submission_count=sub_count,
            graded_count=graded_count,
            my_submission=my_submission_out
        ))
    return result

@router.post("")
async def create_assignment(
    classroom_id: int = Form(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    due_date: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    if teacher.username.lower() == "pirireis":
        classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    else:
        # Teachers can assign homework to classes they manage or existing school classes
        classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()

    if not classroom:
        raise HTTPException(status_code=404, detail="Sınıf bulunamadı.")

    parsed_due_date = None
    if due_date and due_date.strip():
        try:
            parsed_due_date = datetime.fromisoformat(due_date.replace("Z", "+00:00"))
        except Exception:
            try:
                parsed_due_date = datetime.strptime(due_date[:16], "%Y-%m-%dT%H:%M")
            except Exception:
                pass

    rel_path = None
    orig_name = None
    if file and file.filename:
        orig_name = file.filename
        ext = os.path.splitext(orig_name)[1]
        unique_name = f"{uuid.uuid4().hex}{ext}"
        saved_file_path = os.path.join(UPLOAD_DIR, unique_name)
        async with aiofiles.open(saved_file_path, "wb") as out_file:
            content = await file.read()
            await out_file.write(content)
        rel_path = f"/uploads/assignments/{unique_name}"

    assignment = Assignment(
        classroom_id=classroom_id,
        teacher_id=teacher.id,
        title=title.strip(),
        description=description.strip() if description else "",
        due_date=parsed_due_date,
        attachment_path=rel_path,
        attachment_filename=orig_name
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return {"message": "Ödev başarıyla oluşturuldu.", "id": assignment.id}

@router.delete("/{assignment_id}")
def delete_assignment(
    assignment_id: int,
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    if teacher.username.lower() == "pirireis":
        assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    else:
        assignment = db.query(Assignment).join(Classroom, Assignment.classroom_id == Classroom.id).filter(
            Assignment.id == assignment_id,
            (Assignment.teacher_id == teacher.id) | (Classroom.teacher_id == teacher.id)
        ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Ödev bulunamadı veya yetkiniz yok.")

    db.delete(assignment)
    db.commit()
    return {"message": "Ödev başarıyla silindi."}
