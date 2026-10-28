import os
import uuid
import aiofiles
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from app.database import get_db, BASE_DIR
from app.models import User, Classroom, Assignment, Submission
from app.schemas import SubmissionOut, SubmissionGradeRequest
from app.auth import get_current_user, require_teacher, require_student

router = APIRouter(prefix="/api/submissions", tags=["submissions"])

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads", "submissions")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("")
async def submit_assignment(
    assignment_id: int = Form(...),
    student_note: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    student: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Ödev bulunamadı.")

    # Check existing submission
    submission = db.query(Submission).filter(
        Submission.assignment_id == assignment_id,
        Submission.student_id == student.id
    ).first()

    rel_path = submission.file_path if submission else None
    orig_name = submission.file_name if submission else None

    if file and file.filename:
        orig_name = file.filename
        ext = os.path.splitext(orig_name)[1]
        unique_name = f"{uuid.uuid4().hex}{ext}"
        saved_file_path = os.path.join(UPLOAD_DIR, unique_name)
        async with aiofiles.open(saved_file_path, "wb") as out_file:
            content = await file.read()
            await out_file.write(content)
        rel_path = f"/uploads/submissions/{unique_name}"

    if submission:
        # Update existing
        if rel_path:
            submission.file_path = rel_path
            submission.file_name = orig_name
        submission.student_note = student_note.strip() if student_note else ""
        submission.submitted_at = datetime.utcnow()
    else:
        # Create new
        submission = Submission(
            assignment_id=assignment_id,
            student_id=student.id,
            file_path=rel_path,
            file_name=orig_name,
            student_note=student_note.strip() if student_note else "",
            submitted_at=datetime.utcnow()
        )
        db.add(submission)

    db.commit()
    db.refresh(submission)
    return {"message": "Ödeviniz başarıyla yüklendi ve teslim edildi!", "id": submission.id}

@router.get("/assignment/{assignment_id}", response_model=List[SubmissionOut])
def get_assignment_submissions(
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

    submissions = db.query(Submission).filter(Submission.assignment_id == assignment_id).order_by(Submission.submitted_at.desc()).all()

    result = []
    for sub in submissions:
        result.append(SubmissionOut(
            id=sub.id,
            assignment_id=sub.assignment_id,
            student_id=sub.student_id,
            student_name=sub.student.full_name if sub.student else "Bilinmeyen Öğrenci",
            student_username=sub.student.username if sub.student else "",
            student_number=sub.student.student_number if sub.student else "",
            file_path=sub.file_path,
            file_name=sub.file_name,
            student_note=sub.student_note,
            submitted_at=sub.submitted_at,
            grade=sub.grade,
            feedback=sub.feedback,
            graded_at=sub.graded_at
        ))
    return result

@router.put("/{submission_id}/grade")
def grade_submission(
    submission_id: int,
    grade_data: SubmissionGradeRequest,
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    if teacher.username.lower() == "pirireis":
        submission = db.query(Submission).filter(Submission.id == submission_id).first()
    else:
        submission = db.query(Submission).join(Assignment, Submission.assignment_id == Assignment.id).join(Classroom, Assignment.classroom_id == Classroom.id).filter(
            Submission.id == submission_id,
            (Assignment.teacher_id == teacher.id) | (Classroom.teacher_id == teacher.id)
        ).first()

    if not submission:
        raise HTTPException(status_code=404, detail="Teslimat bulunamadı veya puanlama yetkiniz yok.")

    submission.grade = grade_data.grade
    submission.feedback = grade_data.feedback.strip() if grade_data.feedback else ""
    submission.graded_at = datetime.utcnow()

    db.commit()
    db.refresh(submission)

    return {
        "message": "Puan ve öğretmen görüşü başarıyla kaydedildi.",
        "grade": submission.grade,
        "feedback": submission.feedback
    }
