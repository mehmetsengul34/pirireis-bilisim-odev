from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, model_validator

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
    option_e: Optional[str] = None # LGS için opsiyonel
    correct_option: Optional[str] = None # "A", "B", "C", "D", "E"
    correct_answer: Optional[str] = None # Geriye dönük uyumluluk
    explanation: Optional[str] = None
    topic: Optional[str] = None
    subtopic: Optional[str] = None
    learning_outcome_code: Optional[str] = None # Resmî MEB/ÖSYM kazanım kodu
    cognitive_domain: Optional[str] = "Uygulama / Muhakeme" # Hatırlama, Kavrama, Uygulama, Analiz
    distractor_analysis: Optional[str] = None # JSON string
    quality_gate_status: Optional[str] = None # JSON string
    item_difficulty_p: Optional[float] = None
    item_discrimination_d: Optional[float] = None

    @model_validator(mode="before")
    @classmethod
    def normalize_correct_option(cls, data: Any):
        if isinstance(data, dict):
            co = data.get("correct_option") or data.get("correct_answer") or "A"
            data["correct_option"] = str(co).upper().strip()
            data["correct_answer"] = data["correct_option"]
        return data

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
    option_e: Optional[str] = None
    topic: Optional[str] = None
    learning_outcome_code: Optional[str] = None
    cognitive_domain: Optional[str] = "Uygulama / Muhakeme"

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
    question_text: Optional[str] = None
    visual_svg: Optional[str] = None
    option_a: Optional[str] = None
    option_b: Optional[str] = None
    option_c: Optional[str] = None
    option_d: Optional[str] = None
    option_e: Optional[str] = None
    correct_option: str
    explanation: Optional[str] = None
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


# ================= QUESTION BANK SCHEMAS =================

class QuestionBankItem(BaseModel):
    id: int
    exam_type: str
    curriculum_version: Optional[str] = "2024-2025 MEB / ÖSYM"
    grade_level: Optional[str] = "12. Sınıf / Mezun"
    subject: str
    topic: str
    subtopic: Optional[str] = None
    learning_outcome_code: Optional[str] = None
    cognitive_domain: Optional[str] = "Uygulama / Muhakeme"
    difficulty: str
    question_text: str
    visual_svg: Optional[str] = None
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    option_e: Optional[str] = None
    correct_option: str
    explanation: Optional[str] = None
    distractor_analysis: Optional[str] = None
    quality_gate_status: Optional[str] = None
    review_status: Optional[str] = "APPROVED"
    quality_score: Optional[int] = 92
    quality_review: Optional[str] = None
    ai_verified: Optional[bool] = True
    item_difficulty_p: Optional[float] = None
    item_discrimination_d: Optional[float] = None
    version: Optional[int] = 1
    created_by_teacher_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

class QuestionBankUpdate(BaseModel):
    question_text: Optional[str] = None
    visual_svg: Optional[str] = None
    option_a: Optional[str] = None
    option_b: Optional[str] = None
    option_c: Optional[str] = None
    option_d: Optional[str] = None
    option_e: Optional[str] = None
    correct_option: Optional[str] = None
    explanation: Optional[str] = None
    learning_outcome_code: Optional[str] = None
    cognitive_domain: Optional[str] = None
    distractor_analysis: Optional[str] = None
    review_status: Optional[str] = None
    difficulty: Optional[str] = None

class GateAuditResponse(BaseModel):
    question_id: int
    passed_all: bool
    overall_gate_score: float
    review_status: str
    gate_a: Dict[str, Any]
    gate_b: Dict[str, Any]
    gate_c: Dict[str, Any]
    gate_d: Dict[str, Any]
    recommendations: List[str]
    audit_summary: str

class QuestionBankListResponse(BaseModel):
    total: int
    questions: List[QuestionBankItem]
    subjects: List[str]

class CreateExamFromBankRequest(BaseModel):
    title: str
    classroom_id: Optional[int] = None
    exam_type: str = "TYT"
    subject: str = "Genel"
    duration_minutes: int = 40
    due_date: Optional[datetime] = None
    question_ids: List[int]

# ================= AI TRAINING SCHEMAS =================

class AITrainingDocItem(BaseModel):
    id: int
    filename: str
    subject: str
    exam_type: str
    page_count: int
    sample_question_count: int
    analyzed_patterns: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class AITrainingDocListResponse(BaseModel):
    total: int
    documents: List[AITrainingDocItem]

# ================= AUTONOMOUS AI AGENT SCHEMAS =================

class AIAgentActivityOut(BaseModel):
    id: int
    agent_name: str
    action: str
    status: str
    summary: str
    details: Optional[str] = None
    questions_affected: int
    quality_score: float
    created_at: datetime

    class Config:
        from_attributes = True

class AIAgentInfo(BaseModel):
    id: str
    name: str
    role: str
    description: str
    status: str # "Aktif", "Çalışıyor", "Beklemede"
    icon: str
    metrics: Dict[str, Any]

class AIAgentStatusOut(BaseModel):
    is_running: bool
    last_cycle_at: Optional[datetime] = None
    total_activities: int
    total_pool_questions: int
    verified_questions_count: int
    average_quality_score: float
    agents: List[AIAgentInfo]
    recent_activities: List[AIAgentActivityOut]
    learned_style_preview: Optional[str] = None

class AIAgentRunRequest(BaseModel):
    force_pool_enrichment: bool = True
    target_count_per_subject: int = 2
    audit_distractors: bool = True

