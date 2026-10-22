from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

# User Schemas
class LoginRequest(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    full_name: str
    role: str
    student_number: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class CreateStudentRequest(BaseModel):
    username: str
    password: str
    full_name: str
    student_number: Optional[str] = None
    classroom_id: int

# Classroom Schemas
class ClassroomCreate(BaseModel):
    name: str
    grade_level: Optional[str] = "Bilişim Teknolojileri"
    description: Optional[str] = None

class ClassroomOut(BaseModel):
    id: int
    name: str
    grade_level: Optional[str]
    description: Optional[str]
    teacher_id: int
    created_at: datetime
    student_count: int = 0
    assignment_count: int = 0

    class Config:
        from_attributes = True

# Submission Schemas
class SubmissionOut(BaseModel):
    id: int
    assignment_id: int
    student_id: int
    student_name: Optional[str] = None
    student_username: Optional[str] = None
    student_number: Optional[str] = None
    file_path: Optional[str] = None
    file_name: Optional[str] = None
    student_note: Optional[str] = None
    submitted_at: datetime
    grade: Optional[int] = None
    feedback: Optional[str] = None
    graded_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SubmissionGradeRequest(BaseModel):
    grade: int = Field(..., ge=0, le=100)
    feedback: Optional[str] = ""

# Assignment Schemas
class AssignmentCreate(BaseModel):
    classroom_id: int
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None

class AssignmentOut(BaseModel):
    id: int
    classroom_id: int
    classroom_name: Optional[str] = None
    title: str
    description: Optional[str]
    due_date: Optional[datetime]
    attachment_path: Optional[str]
    attachment_filename: Optional[str]
    created_at: datetime
    submission_count: int = 0
    graded_count: int = 0
    my_submission: Optional[SubmissionOut] = None

    class Config:
        from_attributes = True
