from datetime import datetime
from typing import Optional, List, Dict, Any
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

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class CreateTeacherRequest(BaseModel):
    username: str
    password: str
    full_name: str

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
    teacher_id: Optional[int] = None

class ClassroomOut(BaseModel):
    id: int
    name: str
    grade_level: Optional[str]
    description: Optional[str]
    teacher_id: int
    teacher_name: Optional[str] = None
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

# ================= YKS TEST & EXAM SCHEMAS =================

class ExamQuestionBase(BaseModel):
    question_number: int
    question_text: str
    visual_svg: Optional[str] = None
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    option_e: str
    correct_option: str # "A", "B", "C", "D", "E"
    explanation: Optional[str] = None
    topic: Optional[str] = None
    subtopic: Optional[str] = None

class ExamQuestionCreate(ExamQuestionBase):
    pass

class ExamQuestionOut(ExamQuestionBase):
    id: int
    exam_id: int

    class Config:
        from_attributes = True

# Öğrenci sınavdayken doğru cevabı ve çözümü görmemeli
class ExamQuestionStudentOut(BaseModel):
    id: int
    exam_id: int
    question_number: int
    question_text: str
    visual_svg: Optional[str] = None
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    option_e: str
    topic: Optional[str] = None

    class Config:
        from_attributes = True

class GenerateQuestionsRequest(BaseModel):
    exam_type: str = "TYT" # "TYT" or "AYT"
    subject: str # "Temel Matematik", "Türkçe", "Fizik", etc.
    topic: str = "Karma" # "Karma" or specific topic e.g. "Türev"
    difficulty: str = "ÖSYM / Yeni Nesil"
    question_count: int = Field(5, ge=1, le=40)
    include_diagrams: bool = True
    custom_prompt: Optional[str] = None
    gemini_api_key: Optional[str] = None

class ExamCreateRequest(BaseModel):
    classroom_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    exam_type: str = "TYT"
    subject: str
    topic: str = "Karma"
    difficulty: str = "ÖSYM / Yeni Nesil"
    duration_minutes: Optional[int] = None
    due_date: Optional[datetime] = None
    questions: List[ExamQuestionCreate]

class ExamAnswerInput(BaseModel):
    question_id: int
    selected_option: Optional[str] = None # "A", "B", "C", "D", "E" or None (boş)

class ExamSubmitRequest(BaseModel):
    answers: List[ExamAnswerInput]

class ExamAnswerOut(BaseModel):
    question_id: int
    selected_option: Optional[str] = None
    correct_option: Optional[str] = None
    is_correct: bool = False

    class Config:
        from_attributes = True

class ExamSubmissionOut(BaseModel):
    id: int
    exam_id: int
    student_id: int
    student_name: Optional[str] = None
    student_username: Optional[str] = None
    student_number: Optional[str] = None
    started_at: datetime
    submitted_at: datetime
    total_questions: int
    correct_count: int
    incorrect_count: int
    blank_count: int
    net_score: float
    topic_analysis: Optional[str] = None
    answers: Optional[List[ExamAnswerOut]] = None

    class Config:
        from_attributes = True

class ExamOut(BaseModel):
    id: int
    teacher_id: int
    teacher_name: Optional[str] = None
    classroom_id: Optional[int] = None
    classroom_name: Optional[str] = None
    title: str
    description: Optional[str] = None
    exam_type: str
    subject: str
    topic: str
    difficulty: str
    duration_minutes: Optional[int] = None
    due_date: Optional[datetime] = None
    is_published: bool
    created_at: datetime
    question_count: int = 0
    submission_count: int = 0
    my_submission: Optional[ExamSubmissionOut] = None

    class Config:
        from_attributes = True

class ExamDetailOut(ExamOut):
    questions: List[Any] = [] # ExamQuestionOut or ExamQuestionStudentOut

# Sınav Analiz Şeması
class QuestionAnalytic(BaseModel):
    question_number: int
    question_id: int
    topic: Optional[str] = None
    correct_option: str
    correct_count: int
    incorrect_count: int
    blank_count: int
    success_rate: float # 0 - 100 %
    option_distribution: Dict[str, int] # {"A": 3, "B": 10, ...}

class TopicAnalytic(BaseModel):
    topic: str
    question_count: int
    total_answers: int
    correct_answers: int
    incorrect_answers: int
    success_rate: float # 0 - 100 %

class StudentRanking(BaseModel):
    rank: int
    student_id: int
    student_name: str
    student_number: Optional[str] = None
    correct_count: int
    incorrect_count: int
    blank_count: int
    net_score: float
    submitted_at: datetime

class ExamAnalyticsOut(BaseModel):
    exam_id: int
    title: str
    exam_type: str
    subject: str
    topic: str
    classroom_name: Optional[str] = None
    total_students_enrolled: int
    total_submissions: int
    average_net: float
    highest_net: float
    lowest_net: float
    question_analytics: List[QuestionAnalytic]
    topic_analytics: List[TopicAnalytic]
    student_rankings: List[StudentRanking]

# ================= NOTIFICATION SCHEMAS =================

class NotificationCreate(BaseModel):
    receiver_id: Optional[int] = None # None = Sınıfın tümü
    classroom_id: Optional[int] = None
    title: str
    message: str
    notification_type: str = "general" # "exam_assigned", "exam_graded", "general", "alert"
    link_path: Optional[str] = None

class NotificationOut(BaseModel):
    id: int
    sender_id: int
    sender_name: Optional[str] = None
    receiver_id: Optional[int] = None
    classroom_id: Optional[int] = None
    classroom_name: Optional[str] = None
    title: str
    message: str
    notification_type: str
    link_path: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
