import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import engine, Base, SessionLocal, BASE_DIR, get_db_info
from app.models import User, Classroom, ClassroomStudent, Assignment
from app.auth import hash_password
from app.routers import auth, classrooms, assignments, submissions, system, exams, notifications

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Torbalı Piri Reis MTAL - Bilişim Teknolojileri & YKS Test LMS",
    description="Ödev, YKS Test ve Sınav Yönetim Sistemi API",
    version="1.1.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists and mount static files
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(os.path.join(UPLOADS_DIR, "assignments"), exist_ok=True)
os.makedirs(os.path.join(UPLOADS_DIR, "submissions"), exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Include Routers
app.include_router(auth.router)
app.include_router(classrooms.router)
app.include_router(assignments.router)
app.include_router(submissions.router)
app.include_router(exams.router)
app.include_router(notifications.router)
app.include_router(system.router)

@app.on_event("startup")
def startup_seed_data():
    db = SessionLocal()
    try:
        # Check / Create pirireis admin teacher
        pirireis_teacher = db.query(User).filter(User.username == "pirireis").first()
        if not pirireis_teacher:
            pirireis_teacher = User(
                username="pirireis",
                password_hash=hash_password("20262027"),
                full_name="Piri Reis Bilişim Yöneticisi",
                role="teacher"
            )
            db.add(pirireis_teacher)
            db.commit()
            db.refresh(pirireis_teacher)
        else:
            # Guarantee master password is set to 20262027
            pirireis_teacher.password_hash = hash_password("20262027")
            pirireis_teacher.role = "teacher"
            db.commit()

        # Check if sample class exists - only create if database has zero classes
        class_count = db.query(Classroom).count()
        if class_count == 0:
            sample_class = Classroom(
                name="11-B Bilişim - Web Tasarım ve Programlama",
                grade_level="11. Sınıf",
                description="HTML5, CSS3, JavaScript, Python ve Veritabanı uygulamaları",
                teacher_id=pirireis_teacher.id
            )
            db.add(sample_class)
            db.commit()
            db.refresh(sample_class)

            # Check if sample student exists
            student = db.query(User).filter(User.username == "ogrenci").first()
            if not student:
                student = User(
                    username="ogrenci",
                    password_hash=hash_password("123"),
                    full_name="Ali Yılmaz",
                    student_number="1024",
                    role="student"
                )
                db.add(student)
                db.commit()
                db.refresh(student)

                # Enroll student in sample class
                enrollment = ClassroomStudent(
                    classroom_id=sample_class.id,
                    student_id=student.id
                )
                db.add(enrollment)
                db.commit()

            # Check if sample assignment exists
            sample_assignment = db.query(Assignment).filter(Assignment.classroom_id == sample_class.id).first()
            if not sample_assignment:
                sample_assignment = Assignment(
                    classroom_id=sample_class.id,
                    teacher_id=pirireis_teacher.id,
                    title="Hafta 1: Responsive Portfolyo Web Sitesi",
                    description="Flexbox ve Grid kullanarak mobil uyumlu, temiz kodlanmış bir kişisel portfolyo sayfası hazırlayınız. Kodlarınızı zip olarak yükleyiniz.",
                    due_date=None
                )
                db.add(sample_assignment)
                db.commit()

        # Otomatik Soru Bankası Senkronizasyonu
        try:
            from app.routers.exams import sync_exam_questions_to_bank
            sync_exam_questions_to_bank(db)
        except Exception as sync_err:
            print(f"[UYARI] Başlangıç soru bankası eşitleme uyarısı: {sync_err}")

    finally:
        db.close()

@app.get("/api/health")
def health_check():
    db_info = get_db_info()
    return {
        "status": "healthy",
        "school": "Torbalı Piri Reis Mesleki ve Teknik Anadolu Lisesi",
        "department": "Bilişim Teknolojileri Alanı",
        "system": "Ödev ve Sınıf Takip Sistemi",
        "database": db_info
    }
