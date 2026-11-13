import os
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import engine, Base, SessionLocal, BASE_DIR, get_db_info
from app.models import (
    User, Classroom, ClassroomStudent, Assignment, Submission,
    Exam, ExamQuestion, ExamSubmission, ExamAnswer, Notification,
    QuestionBank, AIQuestionTrainingDoc, AIAgentActivity, AIAgentMemory,
    BilisimCourse, BilisimPlan, BilisimModuleDoc, BilisimWeeklyMaterial
)
from app.auth import hash_password
from app.routers import auth, classrooms, assignments, submissions, system, exams, notifications, bilisim, labizleme

# Create database tables
Base.metadata.create_all(bind=engine)

def ensure_schema_compatibility():
    """Mevcut veritabanlarında yeni eklenen alanların (16 Alanlık Soru Standardı vb.) güvenle oluşturulmasını sağlar."""
    from sqlalchemy import text
    try:
        with engine.connect() as conn:
            # SQLite & PostgreSQL uyumlu sütun kontrolü
            if engine.dialect.name == "sqlite":
                # question_bank tablosu kontrolü
                cols_result = conn.execute(text("PRAGMA table_info(question_bank)"))
                qb_cols = [row[1] for row in cols_result.fetchall()]
                if qb_cols:
                    if "quality_score" not in qb_cols:
                        conn.execute(text("ALTER TABLE question_bank ADD COLUMN quality_score INTEGER DEFAULT 92"))
                    if "quality_review" not in qb_cols:
                        conn.execute(text("ALTER TABLE question_bank ADD COLUMN quality_review TEXT"))
                    if "ai_verified" not in qb_cols:
                        conn.execute(text("ALTER TABLE question_bank ADD COLUMN ai_verified BOOLEAN DEFAULT 1"))
                    if "curriculum_version" not in qb_cols:
                        conn.execute(text("ALTER TABLE question_bank ADD COLUMN curriculum_version TEXT DEFAULT '2024-2025 MEB / ÖSYM'"))
                    if "grade_level" not in qb_cols:
                        conn.execute(text("ALTER TABLE question_bank ADD COLUMN grade_level TEXT DEFAULT '12. Sınıf / Mezun'"))
                    if "learning_outcome_code" not in qb_cols:
                        conn.execute(text("ALTER TABLE question_bank ADD COLUMN learning_outcome_code TEXT"))
                    if "cognitive_domain" not in qb_cols:
                        conn.execute(text("ALTER TABLE question_bank ADD COLUMN cognitive_domain TEXT DEFAULT 'Uygulama / Muhakeme'"))
                    if "distractor_analysis" not in qb_cols:
                        conn.execute(text("ALTER TABLE question_bank ADD COLUMN distractor_analysis TEXT"))
                    if "quality_gate_status" not in qb_cols:
                        conn.execute(text("ALTER TABLE question_bank ADD COLUMN quality_gate_status TEXT"))
                    if "review_status" not in qb_cols:
                        conn.execute(text("ALTER TABLE question_bank ADD COLUMN review_status TEXT DEFAULT 'APPROVED'"))
                    if "item_difficulty_p" not in qb_cols:
                        conn.execute(text("ALTER TABLE question_bank ADD COLUMN item_difficulty_p FLOAT"))
                    if "item_discrimination_d" not in qb_cols:
                        conn.execute(text("ALTER TABLE question_bank ADD COLUMN item_discrimination_d FLOAT"))
                    if "version" not in qb_cols:
                        conn.execute(text("ALTER TABLE question_bank ADD COLUMN version INTEGER DEFAULT 1"))

                # exam_questions tablosu kontrolü
                eq_cols_result = conn.execute(text("PRAGMA table_info(exam_questions)"))
                eq_cols = [row[1] for row in eq_cols_result.fetchall()]
                if eq_cols:
                    if "learning_outcome_code" not in eq_cols:
                        conn.execute(text("ALTER TABLE exam_questions ADD COLUMN learning_outcome_code TEXT"))
                    if "cognitive_domain" not in eq_cols:
                        conn.execute(text("ALTER TABLE exam_questions ADD COLUMN cognitive_domain TEXT DEFAULT 'Uygulama / Muhakeme'"))
                    if "distractor_analysis" not in eq_cols:
                        conn.execute(text("ALTER TABLE exam_questions ADD COLUMN distractor_analysis TEXT"))
                    if "quality_gate_status" not in eq_cols:
                        conn.execute(text("ALTER TABLE exam_questions ADD COLUMN quality_gate_status TEXT"))
                    if "item_difficulty_p" not in eq_cols:
                        conn.execute(text("ALTER TABLE exam_questions ADD COLUMN item_difficulty_p FLOAT"))
                    if "item_discrimination_d" not in eq_cols:
                        conn.execute(text("ALTER TABLE exam_questions ADD COLUMN item_discrimination_d FLOAT"))

                # users tablosu plain_password kontrolü
                u_cols_result = conn.execute(text("PRAGMA table_info(users)"))
                u_cols = [row[1] for row in u_cols_result.fetchall()]
                if u_cols and "plain_password" not in u_cols:
                    conn.execute(text("ALTER TABLE users ADD COLUMN plain_password TEXT"))

                conn.commit()

            elif engine.dialect.name == "postgresql":
                # users tablosu
                conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS plain_password VARCHAR(255)"))

                # question_bank tablosu
                conn.execute(text("ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS quality_score INTEGER DEFAULT 92"))
                conn.execute(text("ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS quality_review TEXT"))
                conn.execute(text("ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS ai_verified BOOLEAN DEFAULT TRUE"))
                conn.execute(text("ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS curriculum_version VARCHAR(100) DEFAULT '2024-2025 MEB / ÖSYM'"))
                conn.execute(text("ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS grade_level VARCHAR(50) DEFAULT '12. Sınıf / Mezun'"))
                conn.execute(text("ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS learning_outcome_code VARCHAR(100)"))
                conn.execute(text("ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS cognitive_domain VARCHAR(100) DEFAULT 'Uygulama / Muhakeme'"))
                conn.execute(text("ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS distractor_analysis TEXT"))
                conn.execute(text("ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS quality_gate_status TEXT"))
                conn.execute(text("ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS review_status VARCHAR(50) DEFAULT 'APPROVED'"))
                conn.execute(text("ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS item_difficulty_p FLOAT"))
                conn.execute(text("ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS item_discrimination_d FLOAT"))
                conn.execute(text("ALTER TABLE question_bank ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1"))
                conn.execute(text("ALTER TABLE question_bank ALTER COLUMN option_e DROP NOT NULL"))

                # exam_questions tablosu
                conn.execute(text("ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS learning_outcome_code VARCHAR(100)"))
                conn.execute(text("ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS cognitive_domain VARCHAR(100) DEFAULT 'Uygulama / Muhakeme'"))
                conn.execute(text("ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS distractor_analysis TEXT"))
                conn.execute(text("ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS quality_gate_status TEXT"))
                conn.execute(text("ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS item_difficulty_p FLOAT"))
                conn.execute(text("ALTER TABLE exam_questions ADD COLUMN IF NOT EXISTS item_discrimination_d FLOAT"))
                conn.execute(text("ALTER TABLE exam_questions ALTER COLUMN option_e DROP NOT NULL"))

                conn.commit()
    except Exception as e:
        print(f"[DB Schema Check] Sütun kontrol uyarısı (yeni tablolar zaten güncel): {e}")

ensure_schema_compatibility()

def startup_seed_data():
    db = SessionLocal()
    try:
        # Check / Create pirireis admin teacher
        pirireis_teacher = db.query(User).filter(User.username == "pirireis").first()
        if not pirireis_teacher:
            default_seed_pass = os.getenv("LAB_TEACHER_PASS", "20262027")
            pirireis_teacher = User(
                username="pirireis",
                password_hash=hash_password(default_seed_pass),
                full_name="Piri Reis Bilişim Yöneticisi",
                role="teacher"
            )
            db.add(pirireis_teacher)
            db.commit()
            db.refresh(pirireis_teacher)
        else:
            # Preserve existing user password upon restart; only assign if missing
            if not pirireis_teacher.password_hash:
                pirireis_teacher.password_hash = hash_password(os.getenv("LAB_TEACHER_PASS", "20262027"))
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
                    plain_password="123",
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

            # Varsayılan Bilişim Dersi ve Yıllık Plan Başlatıcı
            sample_b_course = db.query(BilisimCourse).first()
            if not sample_b_course:
                from app.services.bilisim_ai_service import STARTER_CURRICULUMS
                import json
                starter_info = STARTER_CURRICULUMS["mobil_uygulama"]
                new_b_course = BilisimCourse(
                    teacher_id=pirireis_teacher.id,
                    name=starter_info["name"],
                    grade_level=starter_info["grade_level"],
                    academic_year="2026-2027",
                    description=starter_info["description"]
                )
                db.add(new_b_course)
                db.commit()
                db.refresh(new_b_course)

                weeks = starter_info["weeks"]
                raw_lines = [f"{w['week']}. Hafta: {w['topic']} - {w['outcomes']}" for w in weeks]
                init_plan = BilisimPlan(
                    course_id=new_b_course.id,
                    filename="MEB_11_Sinif_Mobil_Uygulama_Yillik_Plan.txt",
                    raw_content="\n".join(raw_lines),
                    parsed_weeks=json.dumps(weeks, ensure_ascii=False)
                )
                db.add(init_plan)

                # Örnek başlangıç MEB modülü ekle
                sample_module = BilisimModuleDoc(
                    course_id=new_b_course.id,
                    title="Modül 1: Android Studio Kurulumu & Arayüz Tasarımı",
                    filename="MEB_Modul_Android_Studio_Arayuz.pdf",
                    file_size_kb=1420,
                    page_count=28,
                    extracted_text="Android Studio ile Mobil Uygulama Geliştirme. ConstraintLayout, XML Arayüz tasarımı, TextView, EditText, Button nesneleri ve setOnClickListener olay dinleyicisi...",
                    summary="Android Studio temel bileşenleri ve XML arayüz mimarisi kılavuzu."
                )
                db.add(sample_module)
                db.commit()

        # Otomatik Soru Bankası Senkronizasyonu
        try:
            from app.routers.exams import sync_exam_questions_to_bank
            sync_exam_questions_to_bank(db)
        except Exception as sync_err:
            print(f"[UYARI] Başlangıç soru bankası eşitleme uyarısı: {sync_err}")

    finally:
        db.close()

async def autonomous_agent_background_loop():
    """Arka planda periyodik olarak çalışan otonom gelişim döngüsü."""
    await asyncio.sleep(8) # Sunucu ilk açılışını tamamlasın
    print("[AIAgent] Otonom arka plan gelişim ajanları nöbete başladı.")
    while True:
        try:
            from app.services.ai_agent_service import AutonomousCoordinator
            db = SessionLocal()
            try:
                print("[AIAgent] Otonom periyodik gelişim döngüsü yürütülüyor...")
                await AutonomousCoordinator.run_full_autonomous_cycle(db, target_count_per_subject=2)
                print("[AIAgent] Otonom döngü başarıyla tamamlandı.")
            finally:
                db.close()
        except Exception as e:
            print(f"[AIAgent] Arka plan döngü uyarısı: {e}")

        # Her 6 saatte bir (21600 sn) periyodik tekrar
        await asyncio.sleep(21600)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Başlangıç tohumlama ve veritabanı eşitleme
    try:
        startup_seed_data()
    except Exception as e:
        print(f"[Startup] Tohumlama uyarısı: {e}")

    # 2. Otonom arka plan ajan döngüsü (Event loop içinde başlatılır)
    agent_task = None
    try:
        agent_task = asyncio.create_task(autonomous_agent_background_loop())
    except Exception as loop_err:
        print(f"[UYARI] Ajan arka plan döngüsü başlatılamadı: {loop_err}")

    yield

    # 3. Kapanışta arka plan görevlerini nazikçe sonlandır
    if agent_task and not agent_task.done():
        agent_task.cancel()
        try:
            await agent_task
        except asyncio.CancelledError:
            pass

app = FastAPI(
    title="Torbalı Piri Reis MTAL - Bilişim Teknolojileri & YKS Test LMS",
    description="Ödev, YKS Test ve Sınav Yönetim Sistemi API",
    version="1.1.0",
    lifespan=lifespan
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
os.makedirs(os.path.join(UPLOADS_DIR, "curriculum"), exist_ok=True)
os.makedirs(os.path.join(UPLOADS_DIR, "modules"), exist_ok=True)
os.makedirs(os.path.join(UPLOADS_DIR, "presentations"), exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Include Routers
app.include_router(auth.router)
app.include_router(classrooms.router)
app.include_router(assignments.router)
app.include_router(submissions.router)
app.include_router(exams.router)
app.include_router(notifications.router)
app.include_router(system.router)
app.include_router(bilisim.router)
app.include_router(labizleme.router)


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
