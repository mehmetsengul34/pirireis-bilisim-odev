from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, UniqueConstraint, Boolean, Float
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(20), nullable=False)  # "teacher" or "student"
    student_number = Column(String(30), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    taught_classes = relationship("Classroom", back_populates="teacher", cascade="all, delete-orphan")
    enrolled_classes = relationship("ClassroomStudent", back_populates="student", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="student", cascade="all, delete-orphan")
    created_assignments = relationship("Assignment", back_populates="teacher", cascade="all, delete-orphan")
    created_exams = relationship("Exam", back_populates="teacher", cascade="all, delete-orphan")
    exam_submissions = relationship("ExamSubmission", back_populates="student", cascade="all, delete-orphan")
    received_notifications = relationship("Notification", back_populates="receiver", foreign_keys="[Notification.receiver_id]", cascade="all, delete-orphan")
    sent_notifications = relationship("Notification", back_populates="sender", foreign_keys="[Notification.sender_id]", cascade="all, delete-orphan")

class Classroom(Base):
    __tablename__ = "classrooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    grade_level = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    teacher = relationship("User", back_populates="taught_classes")
    students = relationship("ClassroomStudent", back_populates="classroom", cascade="all, delete-orphan")
    assignments = relationship("Assignment", back_populates="classroom", cascade="all, delete-orphan")
    exams = relationship("Exam", back_populates="classroom", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="classroom", cascade="all, delete-orphan")

class ClassroomStudent(Base):
    __tablename__ = "classroom_students"

    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("classroom_id", "student_id", name="_classroom_student_uc"),)

    classroom = relationship("Classroom", back_populates="students")
    student = relationship("User", back_populates="enrolled_classes")

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(DateTime, nullable=True)
    attachment_path = Column(String(500), nullable=True)
    attachment_filename = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    classroom = relationship("Classroom", back_populates="assignments")
    teacher = relationship("User", back_populates="created_assignments")
    submissions = relationship("Submission", back_populates="assignment", cascade="all, delete-orphan")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_path = Column(String(500), nullable=True)
    file_name = Column(String(255), nullable=True)
    student_note = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    # Grading
    grade = Column(Integer, nullable=True)  # 0 to 100
    feedback = Column(Text, nullable=True)  # Öğretmen görüşü
    graded_at = Column(DateTime, nullable=True)

    __table_args__ = (UniqueConstraint("assignment_id", "student_id", name="_assignment_student_uc"),)

    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("User", back_populates="submissions")

class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=True) # None = all / draft
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    exam_type = Column(String(50), default="TYT") # "TYT" or "AYT"
    subject = Column(String(100), nullable=False) # örn: "Temel Matematik"
    topic = Column(String(255), default="Karma") # örn: "Karma" veya "Türev"
    difficulty = Column(String(50), default="ÖSYM / Yeni Nesil") # "Kolay", "Orta", "Zor", "ÖSYM / Yeni Nesil"
    duration_minutes = Column(Integer, nullable=True) # None = sınırsız
    due_date = Column(DateTime, nullable=True)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    teacher = relationship("User", back_populates="created_exams")
    classroom = relationship("Classroom", back_populates="exams")
    questions = relationship("ExamQuestion", back_populates="exam", cascade="all, delete-orphan", order_by="ExamQuestion.question_number")
    submissions = relationship("ExamSubmission", back_populates="exam", cascade="all, delete-orphan")

class ExamQuestion(Base):
    __tablename__ = "exam_questions"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"), nullable=False)
    question_number = Column(Integer, nullable=False)
    question_text = Column(Text, nullable=False)
    visual_svg = Column(Text, nullable=True) # Şekil, geometri veya grafik SVG kodu
    option_a = Column(Text, nullable=False)
    option_b = Column(Text, nullable=False)
    option_c = Column(Text, nullable=False)
    option_d = Column(Text, nullable=False)
    option_e = Column(Text, nullable=False)
    correct_option = Column(String(5), nullable=False) # "A", "B", "C", "D", "E"
    explanation = Column(Text, nullable=True) # Ayrıntılı pedagojik çözüm
    topic = Column(String(150), nullable=True)
    subtopic = Column(String(150), nullable=True)

    exam = relationship("Exam", back_populates="questions")
    answers = relationship("ExamAnswer", back_populates="question", cascade="all, delete-orphan")

class ExamSubmission(Base):
    __tablename__ = "exam_submissions"

    id = Column(Integer, primary_key=True, index=True)
    exam_id = Column(Integer, ForeignKey("exams.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    total_questions = Column(Integer, default=0)
    correct_count = Column(Integer, default=0)
    incorrect_count = Column(Integer, default=0)
    blank_count = Column(Integer, default=0)
    net_score = Column(Float, default=0.0)
    topic_analysis = Column(Text, nullable=True) # JSON: {"Konu": {"correct": 2, "incorrect": 1, "blank": 0}}

    __table_args__ = (UniqueConstraint("exam_id", "student_id", name="_exam_student_uc"),)

    exam = relationship("Exam", back_populates="submissions")
    student = relationship("User", back_populates="exam_submissions")
    answers = relationship("ExamAnswer", back_populates="submission", cascade="all, delete-orphan")

class ExamAnswer(Base):
    __tablename__ = "exam_answers"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("exam_submissions.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("exam_questions.id"), nullable=False)
    selected_option = Column(String(5), nullable=True) # None = Boş
    is_correct = Column(Boolean, default=False)

    submission = relationship("ExamSubmission", back_populates="answers")
    question = relationship("ExamQuestion", back_populates="answers")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=True) # None = sınıf geneli
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="general") # "exam_assigned", "exam_graded", "general", "alert"
    link_path = Column(String(255), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_notifications")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_notifications")
    classroom = relationship("Classroom", back_populates="notifications")

class QuestionBank(Base):
    __tablename__ = "question_bank"

    id = Column(Integer, primary_key=True, index=True)
    exam_type = Column(String(50), default="TYT")
    subject = Column(String(100), index=True, nullable=False)
    topic = Column(String(200), index=True, nullable=False)
    subtopic = Column(String(200), nullable=True)
    difficulty = Column(String(50), default="ÖSYM / Yeni Nesil")
    question_text = Column(Text, nullable=False)
    visual_svg = Column(Text, nullable=True)
    option_a = Column(Text, nullable=False)
    option_b = Column(Text, nullable=False)
    option_c = Column(Text, nullable=False)
    option_d = Column(Text, nullable=False)
    option_e = Column(Text, nullable=False)
    correct_option = Column(String(10), nullable=False)
    explanation = Column(Text, nullable=True)
    created_by_teacher_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AIQuestionTrainingDoc(Base):
    __tablename__ = "ai_question_training_docs"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    subject = Column(String(100), index=True, nullable=False)
    exam_type = Column(String(50), default="TYT")
    page_count = Column(Integer, default=1)
    extracted_text = Column(Text, nullable=False)
    analyzed_patterns = Column(Text, nullable=True) # JSON: Soru kalıpları, üslup ve pedagojik rehber
    sample_question_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    teacher = relationship("User")


