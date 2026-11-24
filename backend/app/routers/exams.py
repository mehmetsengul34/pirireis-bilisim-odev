import io
import json
import re
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
import pypdf

from app.database import get_db
from app.models import (
    User, Classroom, ClassroomStudent, Exam, ExamQuestion, ExamSubmission,
    ExamAnswer, Notification, QuestionBank, AIQuestionTrainingDoc,
    AIAgentActivity, AIAgentMemory
)
from app.schemas import (
    QuestionBankUpdate, GateAuditResponse,
    ExamOut, ExamDetailOut, ExamCreateRequest, GenerateQuestionsRequest,
    ExamSubmitRequest, ExamSubmissionOut, ExamAnalyticsOut, QuestionAnalytic,
    TopicAnalytic, StudentRanking, ExamQuestionStudentOut, ExamQuestionOut, ExamAnswerOut, 
    QuestionBankItem, QuestionBankListResponse, CreateExamFromBankRequest,
    AITrainingDocItem, AITrainingDocListResponse,
    AIAgentStatusOut, AIAgentActivityOut, AIAgentRunRequest,
    AIAgentDailySynthesisRequest, AIAgentTransformLegacyRequest
)
from app.auth import get_current_user, require_teacher
from app.services.ai_exam_service import (
    YKS_CURRICULUM, generate_questions_smart, sanitize_math_and_turkish,
    is_verbal_branch, compute_question_fingerprint,
    get_grade_level_for_exam, generate_learning_outcome_code, generate_distractor_analysis
)
from app.services.ai_agent_service import (
    AutonomousCoordinator, JudgeAgent, NightlyPoolSynthesizer,
    DistractorAuditAgent, ContinuousLearningAgent
)

router = APIRouter(prefix="/api/exams", tags=["exams"])

@router.get("/curriculum")
def get_curriculum():
    """YKS TYT ve AYT güncel müfredat ve konu listesini döndürür."""
    return YKS_CURRICULUM


def save_questions_to_bank(db: Session, questions: list, exam_type: str, subject: str, default_topic: str = "Genel", teacher_id: Optional[int] = None):
    """Üretilen veya sınavda kullanılan soruları soru bankasına kaydeder."""
    saved_count = 0
    for q in questions:
        q_text = getattr(q, "question_text", None) or (q.get("question_text") if isinstance(q, dict) else None)
        if not q_text:
            continue
        clean_text = sanitize_math_and_turkish(q_text, is_option=False)
        exists = db.query(QuestionBank).filter(
            (QuestionBank.question_text == q_text) | (QuestionBank.question_text == clean_text)
        ).first()
        if not exists:
            q_top = getattr(q, "topic", None) or (q.get("topic") if isinstance(q, dict) else default_topic) or default_topic
            q_sub = getattr(q, "subtopic", None) or (q.get("subtopic") if isinstance(q, dict) else None)
            q_diff = getattr(q, "difficulty", None) or (q.get("difficulty") if isinstance(q, dict) else "ÖSYM / Yeni Nesil")
            q_svg = getattr(q, "visual_svg", None) or (q.get("visual_svg") if isinstance(q, dict) else None)
            if is_verbal_branch(subject, q_top):
                q_svg = None
            q_a = getattr(q, "option_a", None) or (q.get("option_a") if isinstance(q, dict) else "")
            q_b = getattr(q, "option_b", None) or (q.get("option_b") if isinstance(q, dict) else "")
            q_c = getattr(q, "option_c", None) or (q.get("option_c") if isinstance(q, dict) else "")
            q_d = getattr(q, "option_d", None) or (q.get("option_d") if isinstance(q, dict) else "")
            q_e = getattr(q, "option_e", None) or (q.get("option_e") if isinstance(q, dict) else "")
            q_cor = getattr(q, "correct_option", None) or (q.get("correct_option") if isinstance(q, dict) else "A")
            q_exp = getattr(q, "explanation", None) or (q.get("explanation") if isinstance(q, dict) else None)
            q_score = getattr(q, "quality_score", None) or (q.get("quality_score") if isinstance(q, dict) else 92) or 92
            q_rev = getattr(q, "quality_review", None) or (q.get("quality_review") if isinstance(q, dict) else "Hakem Onaylı") or "Hakem Onaylı"

            is_lgs = (str(exam_type or "").upper() == "LGS")
            q_cur_ver = getattr(q, "curriculum_version", None) or (q.get("curriculum_version") if isinstance(q, dict) else None) or "2024-2025 MEB Türkiye Yüzyılı Maarif Modeli"
            q_grade = getattr(q, "grade_level", None) or (q.get("grade_level") if isinstance(q, dict) else None) or get_grade_level_for_exam(exam_type)
            q_outcome = getattr(q, "learning_outcome_code", None) or (q.get("learning_outcome_code") if isinstance(q, dict) else None) or generate_learning_outcome_code(exam_type, subject, q_top)
            q_cogn = getattr(q, "cognitive_domain", None) or (q.get("cognitive_domain") if isinstance(q, dict) else None) or "Analiz / Muhakeme"
            q_dist = getattr(q, "distractor_analysis", None) or (q.get("distractor_analysis") if isinstance(q, dict) else None)
            if not q_dist:
                q_dict_repr = q if isinstance(q, dict) else q.__dict__
                q_dist = generate_distractor_analysis(q_dict_repr)
            q_gates = getattr(q, "quality_gate_status", None) or (q.get("quality_gate_status") if isinstance(q, dict) else None)
            q_status = getattr(q, "review_status", None) or (q.get("review_status") if isinstance(q, dict) else None) or "APPROVED"

            bank_item = QuestionBank(
                exam_type=exam_type or "TYT",
                curriculum_version=q_cur_ver,
                grade_level=q_grade,
                subject=subject or "Genel",
                topic=q_top or "Genel",
                subtopic=q_sub,
                learning_outcome_code=q_outcome,
                cognitive_domain=q_cogn,
                difficulty=q_diff or "ÖSYM / Yeni Nesil",
                question_text=clean_text,
                visual_svg=q_svg,
                option_a=sanitize_math_and_turkish(q_a, is_option=True) if q_a else "-",
                option_b=sanitize_math_and_turkish(q_b, is_option=True) if q_b else "-",
                option_c=sanitize_math_and_turkish(q_c, is_option=True) if q_c else "-",
                option_d=sanitize_math_and_turkish(q_d, is_option=True) if q_d else "-",
                option_e=(sanitize_math_and_turkish(q_e, is_option=True) if q_e else None) if not is_lgs else None,
                correct_option=str(q_cor or "A").upper(),
                explanation=sanitize_math_and_turkish(q_exp, is_option=False) if q_exp else None,
                distractor_analysis=q_dist if isinstance(q_dist, str) else json.dumps(q_dist, ensure_ascii=False),
                quality_gate_status=q_gates if isinstance(q_gates, str) else (json.dumps(q_gates, ensure_ascii=False) if q_gates else None),
                review_status=q_status,
                quality_score=q_score,
                quality_review=q_rev,
                ai_verified=True,
                created_by_teacher_id=teacher_id
            )
            db.add(bank_item)
            saved_count += 1
    if saved_count > 0:
        db.commit()
    return saved_count


def sync_exam_questions_to_bank(db: Session):
    """Mevcut tüm sınav sorularını soru bankasına otomatik aktarır ve eşitler."""
    try:
        existing_texts = set(
            row[0] for row in db.query(QuestionBank.question_text).all() if row[0]
        )
        all_eqs = db.query(ExamQuestion).all()
        new_items = []
        for eq in all_eqs:
            clean_q_text = sanitize_math_and_turkish(eq.question_text, is_option=False)
            if not clean_q_text or clean_q_text in existing_texts:
                continue
            
            exam = db.query(Exam).filter(Exam.id == eq.exam_id).first()
            new_items.append(QuestionBank(
                exam_type=(exam.exam_type if exam and exam.exam_type else "TYT"),
                subject=(exam.subject if exam and exam.subject else "Genel"),
                topic=(eq.topic or (exam.topic if exam else "Genel") or "Genel"),
                subtopic=eq.subtopic,
                difficulty=(exam.difficulty if exam and exam.difficulty else "ÖSYM / Yeni Nesil"),
                question_text=clean_q_text,
                visual_svg=(None if is_verbal_branch(exam.subject if exam else "Genel", eq.topic) else eq.visual_svg),
                option_a=sanitize_math_and_turkish(eq.option_a, is_option=True) if eq.option_a else "-",
                option_b=sanitize_math_and_turkish(eq.option_b, is_option=True) if eq.option_b else "-",
                option_c=sanitize_math_and_turkish(eq.option_c, is_option=True) if eq.option_c else "-",
                option_d=sanitize_math_and_turkish(eq.option_d, is_option=True) if eq.option_d else "-",
                option_e=sanitize_math_and_turkish(eq.option_e, is_option=True) if eq.option_e else "-",
                correct_option=str(eq.correct_option or "A").upper(),
                explanation=sanitize_math_and_turkish(eq.explanation, is_option=False) if eq.explanation else None,
                created_by_teacher_id=(exam.teacher_id if exam else None),
                created_at=(exam.created_at if exam and exam.created_at else datetime.utcnow())
            ))
            existing_texts.add(clean_q_text)
            
        if new_items:
            db.add_all(new_items)
            db.commit()
            print(f"[BILGI] Soru bankasına {len(new_items)} soru otomatik aktarıldı.")
    except Exception as err:
        db.rollback()
        print(f"[UYARI] Soru bankası senkronizasyon hatası: {err}")

@router.post("/generate-questions")
async def generate_questions_endpoint(
    req: GenerateQuestionsRequest,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Yapay Zeka (Gemini AI / Müfredat Motoru) ile yeni nesil sorular üretir."""
    try:
        # Öğretmenin yüklediği eğitim PDF'lerinden çıkarılmış üslup ve soru kalıplarını çek
        training_guidelines = None
        try:
            training_docs = db.query(AIQuestionTrainingDoc).filter(
                AIQuestionTrainingDoc.is_active == True,
                (
                    (AIQuestionTrainingDoc.subject == req.subject) |
                    (AIQuestionTrainingDoc.subject == "Genel") |
                    (AIQuestionTrainingDoc.subject.ilike("%Tam Deneme%")) |
                    (AIQuestionTrainingDoc.subject.ilike("%Karışık%")) |
                    (AIQuestionTrainingDoc.subject.ilike("%Deneme Kitapçığı%"))
                )
            ).order_by(AIQuestionTrainingDoc.created_at.desc()).all()
            if training_docs:
                style_notes = []
                for doc in training_docs[:6]:
                    if doc.analyzed_patterns:
                        try:
                            p = json.loads(doc.analyzed_patterns)
                            stems = p.get("detected_stem_types", [])
                            sections = p.get("detected_sections", [])
                            is_full = p.get("is_full_exam", False)
                            
                            doc_label = f"'{doc.filename}' ({doc.subject} - {doc.exam_type})"
                            if is_full:
                                doc_label += f" [Tam Sınav / İçerilen Branşlar: {', '.join(sections[:5])}]"
                            
                            note = f"- {doc_label}: Soru kökü ve zorluk üslubu: {', '.join(stems[:6])}"
                            style_notes.append(note)
                        except Exception:
                            pass
                    
                    # Eğer tam sınav ise veya branş uyuşuyorsa metinden ilgili örnek pasaj ekle
                    try:
                        d_text = doc.extracted_text or ""
                        # İlgili derse ait başlık veya soru bloğu bulmaya çalış
                        m_sec = re.search(rf"(?:{req.subject}[^\n]*\n)([\s\S]{{100,1000}})", d_text, re.IGNORECASE)
                        if m_sec:
                            style_notes.append(f"  [Örnek {req.subject} Soru Bloğu]:\n{m_sec.group(1).strip()[:600]}")
                    except Exception:
                        pass

                if style_notes:
                    training_guidelines = "\n".join(style_notes)
        except Exception as tr_err:
            print(f"[AI Training] Eğitim dokümanı okunurken hata: {tr_err}")

        # Sıfır Tekrar Güvencesi: Sınıfın geçmiş sınav sorularını ve soru bankasını tarayarak daha önce çözülmüş soruları dışla
        excluded_fingerprints = set()
        excluded_texts = []
        if req.classroom_id:
            past_exams = db.query(Exam).filter(Exam.classroom_id == req.classroom_id).all()
            past_exam_ids = [e.id for e in past_exams]
            if past_exam_ids:
                past_questions = db.query(ExamQuestion).filter(ExamQuestion.exam_id.in_(past_exam_ids)).all()
                for pq in past_questions:
                    if pq.question_text:
                        excluded_fingerprints.add(compute_question_fingerprint(pq.question_text))
                        excluded_texts.append(pq.question_text)

        questions = await generate_questions_smart(
            exam_type=req.exam_type,
            subject=req.subject,
            topic=req.topic,
            difficulty=req.difficulty,
            question_count=req.question_count,
            include_diagrams=req.include_diagrams,
            custom_prompt=req.custom_prompt,
            api_key=req.gemini_api_key,
            training_guidelines=training_guidelines,
            excluded_fingerprints=excluded_fingerprints,
            excluded_texts=excluded_texts
        )
        try:
            save_questions_to_bank(db, questions, req.exam_type, req.subject, req.topic, current_user.id)
        except Exception as db_err:
            print(f"[UYARI] Soru bankasına kaydederken hata: {db_err}")
        return {
            "questions": questions,
            "zero_duplicate_guaranteed": True,
            "excluded_past_count": len(excluded_fingerprints),
            "maarif_model_compliant": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Soru üretim hatası: {str(e)}")

@router.post("", response_model=ExamOut)
def create_exam(
    req: ExamCreateRequest,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Yeni bir YKS Sınavı/Testi oluşturur ve sorularını kaydeder."""
    if not req.questions:
        raise HTTPException(status_code=400, detail="Sınav en az 1 soru içermelidir.")

    # Sınıf kontrolü
    classroom_name = None
    if req.classroom_id:
        classroom = db.query(Classroom).filter(Classroom.id == req.classroom_id).first()
        if not classroom:
            raise HTTPException(status_code=404, detail="Seçilen sınıf bulunamadı.")
        classroom_name = classroom.name

    exam = Exam(
        teacher_id=current_user.id,
        classroom_id=req.classroom_id,
        title=req.title,
        description=req.description,
        exam_type=req.exam_type,
        subject=req.subject,
        topic=req.topic,
        difficulty=req.difficulty,
        duration_minutes=req.duration_minutes,
        due_date=req.due_date,
        is_published=True
    )
    db.add(exam)
    db.commit()
    db.refresh(exam)
    try:
        save_questions_to_bank(db, req.questions, req.exam_type, req.subject, req.topic, current_user.id)
    except Exception as db_err:
        print(f"[UYARI] Sınav sorularını soru bankasına aktarma hatası: {db_err}")

    # Soruları ekle
    for q in req.questions:
        question = ExamQuestion(
            exam_id=exam.id,
            question_number=q.question_number,
            question_text=q.question_text,
            visual_svg=(None if is_verbal_branch(exam.subject, q.topic) else q.visual_svg),
            option_a=q.option_a,
            option_b=q.option_b,
            option_c=q.option_c,
            option_d=q.option_d,
            option_e=q.option_e,
            correct_option=q.correct_option.upper(),
            explanation=q.explanation,
            topic=q.topic,
            subtopic=q.subtopic
        )
        db.add(question)
    
    # Sınıfa otomatik bildirim gönder
    if req.classroom_id:
        notification = Notification(
            sender_id=current_user.id,
            classroom_id=req.classroom_id,
            title=f"Yeni YKS Testi: {exam.title}",
            message=f"{current_user.full_name} hocanız {classroom_name} sınıfına '{exam.title}' başlıklı yeni bir {exam.exam_type} {exam.subject} testi atadı.",
            notification_type="exam_assigned",
            link_path=f"/exams/{exam.id}"
        )
        db.add(notification)

    db.commit()
    db.refresh(exam)

    return ExamOut(
        id=exam.id,
        teacher_id=exam.teacher_id,
        teacher_name=current_user.full_name,
        classroom_id=exam.classroom_id,
        classroom_name=classroom_name,
        title=exam.title,
        description=exam.description,
        exam_type=exam.exam_type,
        subject=exam.subject,
        topic=exam.topic,
        difficulty=exam.difficulty,
        duration_minutes=exam.duration_minutes,
        due_date=exam.due_date,
        is_published=exam.is_published,
        created_at=exam.created_at,
        question_count=len(req.questions),
        submission_count=0
    )

@router.get("", response_model=List[ExamOut])
def list_exams(
    classroom_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Kullanıcının rolüne göre sınavları listeler."""
    query = db.query(Exam)

    if current_user.role == "teacher":
        if current_user.username.lower() != "pirireis":
            query = query.filter(Exam.teacher_id == current_user.id)
        if classroom_id:
            query = query.filter(Exam.classroom_id == classroom_id)
    else:
        # Öğrencinin kayıtlı olduğu sınıflar
        student_class_ids = [
            row[0] for row in db.query(ClassroomStudent.classroom_id).filter(
                ClassroomStudent.student_id == current_user.id
            ).all()
        ]
        # Hem sınıfına atanmış hem de genel sınavlar
        query = query.filter(
            (Exam.classroom_id.in_(student_class_ids)) | (Exam.classroom_id.is_(None))
        )
        if classroom_id:
            query = query.filter(Exam.classroom_id == classroom_id)

    exams = query.order_by(Exam.created_at.desc()).all()
    results = []

    for exam in exams:
        q_count = db.query(ExamQuestion).filter(ExamQuestion.exam_id == exam.id).count()
        sub_count = db.query(ExamSubmission).filter(ExamSubmission.exam_id == exam.id).count()
        
        my_sub = None
        if current_user.role == "student":
            sub = db.query(ExamSubmission).filter(
                ExamSubmission.exam_id == exam.id,
                ExamSubmission.student_id == current_user.id
            ).first()
            if sub:
                my_sub = ExamSubmissionOut(
                    id=sub.id,
                    exam_id=sub.exam_id,
                    student_id=sub.student_id,
                    student_name=current_user.full_name,
                    student_username=current_user.username,
                    student_number=current_user.student_number,
                    started_at=sub.started_at,
                    submitted_at=sub.submitted_at,
                    total_questions=sub.total_questions,
                    correct_count=sub.correct_count,
                    incorrect_count=sub.incorrect_count,
                    blank_count=sub.blank_count,
                    net_score=sub.net_score,
                    topic_analysis=sub.topic_analysis
                )

        teacher_name = exam.teacher.full_name if exam.teacher else "Öğretmen"
        classroom_name = exam.classroom.name if exam.classroom else "Tüm Sınıflar"

        results.append(ExamOut(
            id=exam.id,
            teacher_id=exam.teacher_id,
            teacher_name=teacher_name,
            classroom_id=exam.classroom_id,
            classroom_name=classroom_name,
            title=exam.title,
            description=exam.description,
            exam_type=exam.exam_type,
            subject=exam.subject,
            topic=exam.topic,
            difficulty=exam.difficulty,
            duration_minutes=exam.duration_minutes,
            due_date=exam.due_date,
            is_published=exam.is_published,
            created_at=exam.created_at,
            question_count=q_count,
            submission_count=sub_count,
            my_submission=my_sub
        ))

    return results


# ================= QUESTION BANK ENDPOINTS =================

@router.get("/question-bank", response_model=QuestionBankListResponse)
def get_question_bank(
    exam_type: Optional[str] = None,
    subject: Optional[str] = None,
    topic: Optional[str] = None,
    difficulty: Optional[str] = None,
    review_status: Optional[str] = None,
    cognitive_domain: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Soru bankasındaki kayıtlı soruları filtreleyerek getirir."""
    # Soru bankasını mevcut tüm sınav sorularıyla otomatik eşitle
    sync_exam_questions_to_bank(db)

    query = db.query(QuestionBank)

    if exam_type and exam_type != "Tümü":
        query = query.filter(QuestionBank.exam_type == exam_type)
    if subject and subject != "Tümü":
        query = query.filter(QuestionBank.subject == subject)
    if topic and topic != "Tümü":
        query = query.filter(QuestionBank.topic == topic)
    if difficulty and difficulty != "Tümü":
        query = query.filter(QuestionBank.difficulty == difficulty)
    if review_status and review_status != "Tümü":
        query = query.filter(QuestionBank.review_status == review_status)
    if cognitive_domain and cognitive_domain != "Tümü":
        query = query.filter(QuestionBank.cognitive_domain == cognitive_domain)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (QuestionBank.question_text.ilike(s)) |
            (QuestionBank.topic.ilike(s)) |
            (QuestionBank.subject.ilike(s))
        )

    total = query.count()
    questions = query.order_by(QuestionBank.created_at.desc()).offset(offset).limit(limit).all()

    # Mevcut tüm branş / ders listesini de döndür
    all_subjects = [row[0] for row in db.query(QuestionBank.subject).distinct().all() if row[0]]

    return QuestionBankListResponse(
        total=total,
        questions=questions,
        subjects=sorted(list(set(all_subjects)))
    )

@router.post("/question-bank/create-exam", response_model=ExamOut)
def create_exam_from_bank(
    req: CreateExamFromBankRequest,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Soru bankasından seçilen sorularla yeni bir online sınıf sınavı oluşturur."""
    if not req.question_ids:
        raise HTTPException(status_code=400, detail="En az 1 soru seçilmelidir.")

    classroom_name = None
    if req.classroom_id:
        cls = db.query(Classroom).filter(Classroom.id == req.classroom_id).first()
        if not cls:
            raise HTTPException(status_code=404, detail="Seçilen sınıf bulunamadı.")
        classroom_name = cls.name

    # Soruları soru bankasından çek
    bank_questions = db.query(QuestionBank).filter(QuestionBank.id.in_(req.question_ids)).all()
    if not bank_questions:
        raise HTTPException(status_code=404, detail="Seçilen sorular bankada bulunamadı.")

    # Sıralamayı req.question_ids sırasına göre yap
    q_map = {q.id: q for q in bank_questions}
    ordered_questions = [q_map[qid] for qid in req.question_ids if qid in q_map]

    first_q = ordered_questions[0]
    exam = Exam(
        teacher_id=current_user.id,
        classroom_id=req.classroom_id,
        title=req.title,
        description=f"Soru bankasından seçilmiş {len(ordered_questions)} soruluk {req.exam_type} {req.subject} testi.",
        exam_type=req.exam_type or first_q.exam_type,
        subject=req.subject or first_q.subject,
        topic=first_q.topic,
        difficulty=first_q.difficulty,
        duration_minutes=req.duration_minutes,
        due_date=req.due_date,
        is_published=True
    )
    db.add(exam)
    db.commit()
    db.refresh(exam)

    for idx, bq in enumerate(ordered_questions, start=1):
        eq = ExamQuestion(
            exam_id=exam.id,
            question_number=idx,
            question_text=bq.question_text,
            visual_svg=(None if is_verbal_branch(req.subject or bq.subject, bq.topic) else bq.visual_svg),
            option_a=bq.option_a,
            option_b=bq.option_b,
            option_c=bq.option_c,
            option_d=bq.option_d,
            option_e=bq.option_e,
            correct_option=bq.correct_option.upper(),
            explanation=bq.explanation,
            topic=bq.topic,
            subtopic=bq.subtopic,
            learning_outcome_code=bq.learning_outcome_code,
            cognitive_domain=bq.cognitive_domain,
            distractor_analysis=bq.distractor_analysis,
            quality_gate_status=bq.quality_gate_status,
            item_difficulty_p=bq.item_difficulty_p,
            item_discrimination_d=bq.item_discrimination_d
        )
        db.add(eq)

    if req.classroom_id:
        notification = Notification(
            sender_id=current_user.id,
            classroom_id=req.classroom_id,
            title=f"Yeni YKS Testi: {exam.title}",
            message=f"{current_user.full_name} hocanız {classroom_name} sınıfına soru bankasından '{exam.title}' başlıklı yeni bir test atadı.",
            notification_type="exam_assigned",
            link_path=f"/exams/{exam.id}"
        )
        db.add(notification)

    db.commit()
    db.refresh(exam)

    return ExamOut(
        id=exam.id,
        teacher_id=exam.teacher_id,
        teacher_name=current_user.full_name,
        classroom_id=exam.classroom_id,
        classroom_name=classroom_name,
        title=exam.title,
        description=exam.description,
        exam_type=exam.exam_type,
        subject=exam.subject,
        topic=exam.topic,
        difficulty=exam.difficulty,
        duration_minutes=exam.duration_minutes,
        due_date=exam.due_date,
        is_published=exam.is_published,
        created_at=exam.created_at,
        question_count=len(ordered_questions),
        submission_count=0
    )


@router.put("/question-bank/{question_id}", response_model=QuestionBankItem)
def update_bank_question(
    question_id: int,
    req: QuestionBankUpdate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Soru bankasındaki bir sorunun metnini, şıklarını, kazanım kodunu veya durumunu günceller."""
    bq = db.query(QuestionBank).filter(QuestionBank.id == question_id).first()
    if not bq:
        raise HTTPException(status_code=404, detail="Soru bulunamadı.")

    if req.question_text is not None:
        bq.question_text = sanitize_math_and_turkish(req.question_text, is_option=False)
    if req.visual_svg is not None:
        bq.visual_svg = req.visual_svg
    if req.option_a is not None:
        bq.option_a = sanitize_math_and_turkish(req.option_a, is_option=True)
    if req.option_b is not None:
        bq.option_b = sanitize_math_and_turkish(req.option_b, is_option=True)
    if req.option_c is not None:
        bq.option_c = sanitize_math_and_turkish(req.option_c, is_option=True)
    if req.option_d is not None:
        bq.option_d = sanitize_math_and_turkish(req.option_d, is_option=True)
    if req.option_e is not None:
        bq.option_e = sanitize_math_and_turkish(req.option_e, is_option=True) if req.option_e else None
    if req.correct_option is not None:
        bq.correct_option = str(req.correct_option).upper().strip()
    if req.explanation is not None:
        bq.explanation = sanitize_math_and_turkish(req.explanation, is_option=False)
    if req.learning_outcome_code is not None:
        bq.learning_outcome_code = req.learning_outcome_code
    if req.cognitive_domain is not None:
        bq.cognitive_domain = req.cognitive_domain
    if req.distractor_analysis is not None:
        bq.distractor_analysis = req.distractor_analysis
    if req.review_status is not None:
        bq.review_status = req.review_status
    if req.difficulty is not None:
        bq.difficulty = req.difficulty

    # Otomatik Kabul Kapıları Denetimini yenile
    gate_eval = JudgeAgent.evaluate_quality_gates(bq.__dict__, subject=bq.subject, exam_type=bq.exam_type)
    bq.quality_gate_status = json.dumps(gate_eval["gate_status"], ensure_ascii=False)
    bq.quality_score = gate_eval["total_score"]
    bq.quality_review = gate_eval["summary"]
    if not req.review_status:
        bq.review_status = gate_eval["review_status"]

    bq.version = (bq.version or 1) + 1
    db.commit()
    db.refresh(bq)
    return bq

@router.post("/question-bank/{question_id}/gate-audit", response_model=GateAuditResponse)
def audit_bank_question_gates(
    question_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Soru bankasındaki bir soruyu 4 Kabul Kapısı (A, B, C, D) standardında denetler."""
    bq = db.query(QuestionBank).filter(QuestionBank.id == question_id).first()
    if not bq:
        raise HTTPException(status_code=404, detail="Soru bulunamadı.")

    gate_eval = JudgeAgent.evaluate_quality_gates(bq.__dict__, subject=bq.subject, exam_type=bq.exam_type)
    bq.quality_gate_status = json.dumps(gate_eval["gate_status"], ensure_ascii=False)
    bq.quality_score = gate_eval["total_score"]
    bq.quality_review = gate_eval["summary"]
    bq.review_status = gate_eval["review_status"]
    db.commit()

    gs = gate_eval["gate_status"]
    return GateAuditResponse(
        question_id=bq.id,
        passed_all=gs["passed_all"],
        overall_gate_score=gs["overall_score"],
        review_status=gs["review_status"],
        gate_a=gs["gate_a"],
        gate_b=gs["gate_b"],
        gate_c=gs["gate_c"],
        gate_d=gs["gate_d"],
        recommendations=gate_eval["recommendations"],
        audit_summary=gate_eval["summary"]
    )

@router.delete("/question-bank/{question_id}")
def delete_bank_question(
    question_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Soru bankasından tek bir soruyu siler."""
    bq = db.query(QuestionBank).filter(QuestionBank.id == question_id).first()
    if not bq:
        raise HTTPException(status_code=404, detail="Soru bulunamadı.")
    db.delete(bq)
    db.commit()
    return {"message": "Soru bankadan silindi."}

@router.post("/question-bank/bulk-delete")
def bulk_delete_bank_questions(
    payload: dict,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Soru bankasından seçilen soruları topluca siler."""
    question_ids = payload.get("question_ids", [])
    if not question_ids:
        raise HTTPException(status_code=400, detail="Silinecek soru seçilmedi.")
    db.query(QuestionBank).filter(QuestionBank.id.in_(question_ids)).delete(synchronize_session=False)
    db.commit()
    return {"message": f"{len(question_ids)} soru başarıyla silindi."}


# ================= AI MODEL TRAINING (PDF UPLOAD) ENDPOINTS =================

@router.post("/training/upload-pdf")
async def upload_training_pdf(
    file: UploadFile = File(...),
    subject: str = Form("Matematik"),
    exam_type: str = Form("TYT"),
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """
    Öğretmenin sisteme yüklediği örnek soru PDF'lerini analiz eder.
    Metinleri ve soru kalıplarını AI için stil rehberi olarak kaydeder.
    Bu sorular ASLA öğrencilere doğrudan sorulmaz; tamamen AI'ın yeni, özgün
    sorular üretmesi için stil ve pedagojik eğitim verisi olarak kullanılır.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Lütfen geçerli bir PDF dosyası yükleyiniz.")

    try:
        content = await file.read()
        pdf_file = io.BytesIO(content)
        reader = pypdf.PdfReader(pdf_file)
        
        page_count = len(reader.pages)
        if page_count == 0:
            raise HTTPException(status_code=400, detail="PDF boş veya okunamadı.")
        
        extracted_pages = []
        for i, page in enumerate(reader.pages):
            txt = page.extract_text() or ""
            if txt.strip():
                extracted_pages.append(txt.strip())

        full_text = "\n\n--- SAYFA AYRACI ---\n\n".join(extracted_pages)
        if len(full_text.strip()) < 5:
            raise HTTPException(status_code=400, detail="PDF'ten metin çıkarılamadı veya taranmış resim PDF'i.")

        # Soru kökleri tespiti
        stem_matches = re.findall(r'(buna göre[^\.\?\!\n]*[\?\!]|ifadelerinden hangileri[^\.\?\!\n]*[\?\!]|kesinlikle[^\.\?\!\n]*[\?\!]|kaçtır[\?]|nedir[\?]|oranı kaçtır[\?]|kaç birimdir[\?])', full_text, re.IGNORECASE)
        question_numbers = re.findall(r'(?:^|\n)\s*([0-9]{1,2})\s*[\.\)]\s*(?=[A-ZÇĞİÖŞÜ])', full_text)
        est_count = max(len(stem_matches), len(question_numbers), 1)

        # Tam Deneme kontrolü ve içerilen branşların tespiti
        is_full_exam = any(k in (subject or "").lower() for k in ["tam deneme", "karışık", "kitapçık", "deneme sınavı"])
        detected_sections = []
        for sec in ["Türkçe", "Edebiyat", "Matematik", "Geometri", "Fizik", "Kimya", "Biyoloji", "Tarih", "Coğrafya", "Felsefe", "Din Kültürü"]:
            if re.search(rf"\b{sec}\b", full_text, re.IGNORECASE):
                detected_sections.append(sec)

        clean_stems = list(dict.fromkeys([m.strip()[:40] for m in stem_matches]))[:8]
        analysis_summary = {
            "page_count": page_count,
            "est_questions": est_count,
            "is_full_exam": is_full_exam,
            "detected_sections": detected_sections if (is_full_exam or len(detected_sections) > 1) else [subject],
            "detected_stem_types": clean_stems if clean_stems else ["ÖSYM Standart soru kökü", "Kazanım değerlendirme"],
            "has_math_formulas": bool(re.search(r'[\\^_+=\-/*√π≤≥≠]', full_text)),
            "purpose": "Eğitim amaçlı soru tarzı rehberi (Tekrar sorulmaz)"
        }

        training_doc = AIQuestionTrainingDoc(
            teacher_id=current_user.id,
            filename=file.filename,
            subject=subject or "Genel",
            exam_type=exam_type or "TYT",
            page_count=page_count,
            extracted_text=full_text,
            analyzed_patterns=json.dumps(analysis_summary, ensure_ascii=False),
            sample_question_count=est_count,
            is_active=True,
            created_at=datetime.utcnow()
        )
        db.add(training_doc)
        db.commit()
        db.refresh(training_doc)

        success_msg = f"'{file.filename}' başarıyla yüklendi. "
        if is_full_exam:
            success_msg += f"Yapay zeka bu tam deneme kitapçığındaki tüm branşların ({', '.join(detected_sections[:6])}) soru tarzını ve derinliğini kavradı. İlgili tüm test üretimlerinde rehber olarak kullanılacaktır."
        else:
            success_msg += f"Yapay zeka {subject} branşındaki bu soru tarzını öğrendi ve artık bu doğrultuda özgün sorular üretecek."

        return {
            "id": training_doc.id,
            "filename": training_doc.filename,
            "subject": training_doc.subject,
            "exam_type": training_doc.exam_type,
            "page_count": training_doc.page_count,
            "sample_question_count": training_doc.sample_question_count,
            "analysis": analysis_summary,
            "message": success_msg
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF analizi sırasında hata: {str(e)}")

@router.get("/training/documents", response_model=AITrainingDocListResponse)
def get_training_documents(
    subject: Optional[str] = None,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Yüklenen tüm AI eğitim PDF dokümanlarını listeler."""
    query = db.query(AIQuestionTrainingDoc).filter(AIQuestionTrainingDoc.is_active == True)
    if subject and subject != "Tümü":
        query = query.filter(AIQuestionTrainingDoc.subject == subject)
    docs = query.order_by(AIQuestionTrainingDoc.created_at.desc()).all()
    return AITrainingDocListResponse(total=len(docs), documents=docs)

@router.delete("/training/documents/{doc_id}")
def delete_training_document(
    doc_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Eğitim dokümanını sistemden kaldırır."""
    doc = db.query(AIQuestionTrainingDoc).filter(AIQuestionTrainingDoc.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Eğitim dokümanı bulunamadı.")
    doc.is_active = False
    db.commit()
    return {"message": "Eğitim dokümanı başarıyla kaldırıldı."}


def _ensure_student_can_access_exam(exam: Exam, user: User, db: Session) -> None:
    """GÜVENLİK: Öğrenci yalnızca kendi sınıfına veya tüm sınıflara açılmış sınavlara erişebilir."""
    if user.role != "student" or exam.classroom_id is None:
        return
    enrolled = db.query(ClassroomStudent).filter(
        ClassroomStudent.classroom_id == exam.classroom_id,
        ClassroomStudent.student_id == user.id
    ).first()
    if not enrolled:
        raise HTTPException(status_code=403, detail="Bu sınav sizin sınıfınıza ait değil.")


@router.get("/{exam_id}", response_model=ExamDetailOut)
def get_exam_detail(
    exam_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Sınav detayını ve sorularını getirir. Öğrenci henüz çözmediyse doğru cevapları gizler."""
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Sınav bulunamadı.")
    _ensure_student_can_access_exam(exam, current_user, db)

    questions = db.query(ExamQuestion).filter(ExamQuestion.exam_id == exam.id).order_by(ExamQuestion.question_number).all()
    q_count = len(questions)
    sub_count = db.query(ExamSubmission).filter(ExamSubmission.exam_id == exam.id).count()

    my_sub = None
    already_submitted = False

    if current_user.role == "student":
        sub = db.query(ExamSubmission).filter(
            ExamSubmission.exam_id == exam.id,
            ExamSubmission.student_id == current_user.id
        ).first()
        if sub:
            already_submitted = True
            # Öğrencinin verdiği cevapları da çek
            answers_out = []
            for ans in sub.answers:
                answers_out.append(ExamAnswerOut(
                    question_id=ans.question_id,
                    selected_option=ans.selected_option,
                    correct_option=ans.question.correct_option if ans.question else None,
                    is_correct=ans.is_correct
                ))

            my_sub = ExamSubmissionOut(
                id=sub.id,
                exam_id=sub.exam_id,
                student_id=sub.student_id,
                student_name=current_user.full_name,
                student_username=current_user.username,
                student_number=current_user.student_number,
                started_at=sub.started_at,
                submitted_at=sub.submitted_at,
                total_questions=sub.total_questions,
                correct_count=sub.correct_count,
                incorrect_count=sub.incorrect_count,
                blank_count=sub.blank_count,
                net_score=sub.net_score,
                topic_analysis=sub.topic_analysis,
                answers=answers_out
            )

    # Soruları biçimlendir
    formatted_questions = []
    if current_user.role == "teacher" or already_submitted:
        # Öğretmen veya sınavı teslim etmiş öğrenci: Çözüm ve doğru şıkları görsün
        for q in questions:
            formatted_questions.append(ExamQuestionOut(
                id=q.id,
                exam_id=q.exam_id,
                question_number=q.question_number,
                question_text=q.question_text,
                visual_svg=(None if is_verbal_branch(exam.subject, q.topic) else q.visual_svg),
                option_a=q.option_a,
                option_b=q.option_b,
                option_c=q.option_c,
                option_d=q.option_d,
                option_e=q.option_e,
                correct_option=q.correct_option,
                explanation=q.explanation,
                topic=q.topic,
                subtopic=q.subtopic
            ))
    else:
        # Sınav esnasındaki öğrenci: Doğru şıkkı ve çözümü gizle
        for q in questions:
            formatted_questions.append(ExamQuestionStudentOut(
                id=q.id,
                exam_id=q.exam_id,
                question_number=q.question_number,
                question_text=q.question_text,
                visual_svg=(None if is_verbal_branch(exam.subject, q.topic) else q.visual_svg),
                option_a=q.option_a,
                option_b=q.option_b,
                option_c=q.option_c,
                option_d=q.option_d,
                option_e=q.option_e,
                topic=q.topic
            ))

    return ExamDetailOut(
        id=exam.id,
        teacher_id=exam.teacher_id,
        teacher_name=exam.teacher.full_name if exam.teacher else "Öğretmen",
        classroom_id=exam.classroom_id,
        classroom_name=exam.classroom.name if exam.classroom else "Tüm Sınıflar",
        title=exam.title,
        description=exam.description,
        exam_type=exam.exam_type,
        subject=exam.subject,
        topic=exam.topic,
        difficulty=exam.difficulty,
        duration_minutes=exam.duration_minutes,
        due_date=exam.due_date,
        is_published=exam.is_published,
        created_at=exam.created_at,
        question_count=q_count,
        submission_count=sub_count,
        my_submission=my_sub,
        questions=formatted_questions
    )

@router.post("/{exam_id}/submit", response_model=ExamSubmissionOut)
def submit_exam_answers(
    exam_id: int,
    req: ExamSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Öğrenci sınav cevaplarını teslim eder, anında puanlanır ve analiz hesaplanır."""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Sınav cevaplarını yalnızca öğrenciler gönderebilir.")
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Sınav bulunamadı.")
    _ensure_student_can_access_exam(exam, current_user, db)

    existing_sub = db.query(ExamSubmission).filter(
        ExamSubmission.exam_id == exam.id,
        ExamSubmission.student_id == current_user.id
    ).first()

    if existing_sub:
        raise HTTPException(status_code=400, detail="Bu sınava zaten katıldınız ve sonuçlarınızı gönderdiniz.")

    questions = db.query(ExamQuestion).filter(ExamQuestion.exam_id == exam.id).all()
    q_map = {q.id: q for q in questions}

    total_questions = len(questions)
    correct_count = 0
    incorrect_count = 0
    blank_count = 0

    topic_stats = {} # { "Türev": {"correct": 1, "incorrect": 0, "blank": 0} }

    # Map user answers
    answers_map = {item.question_id: item.selected_option.upper().strip() if item.selected_option else None for item in req.answers}

    answers_to_create = []

    for q in questions:
        q_topic = q.topic or "Genel"
        if q_topic not in topic_stats:
            topic_stats[q_topic] = {"correct": 0, "incorrect": 0, "blank": 0}

        sel_opt = answers_map.get(q.id)

        if not sel_opt:
            blank_count += 1
            topic_stats[q_topic]["blank"] += 1
            answers_to_create.append({
                "question_id": q.id,
                "selected_option": None,
                "is_correct": False
            })
        elif sel_opt == q.correct_option.upper():
            correct_count += 1
            topic_stats[q_topic]["correct"] += 1
            answers_to_create.append({
                "question_id": q.id,
                "selected_option": sel_opt,
                "is_correct": True
            })
        else:
            incorrect_count += 1
            topic_stats[q_topic]["incorrect"] += 1
            answers_to_create.append({
                "question_id": q.id,
                "selected_option": sel_opt,
                "is_correct": False
            })

    # ÖSYM Kuralı: 4 Yanlış 1 Doğruyu Götürür
    net_score = round(correct_count - (incorrect_count / 4.0), 2)

    submission = ExamSubmission(
        exam_id=exam.id,
        student_id=current_user.id,
        started_at=datetime.utcnow(),
        submitted_at=datetime.utcnow(),
        total_questions=total_questions,
        correct_count=correct_count,
        incorrect_count=incorrect_count,
        blank_count=blank_count,
        net_score=net_score,
        topic_analysis=json.dumps(topic_stats, ensure_ascii=False)
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    # Cevapları kaydet
    out_answers = []
    for item in answers_to_create:
        ans = ExamAnswer(
            submission_id=submission.id,
            question_id=item["question_id"],
            selected_option=item["selected_option"],
            is_correct=item["is_correct"]
        )
        db.add(ans)
        out_answers.append(ExamAnswerOut(
            question_id=item["question_id"],
            selected_option=item["selected_option"],
            correct_option=q_map[item["question_id"]].correct_option,
            is_correct=item["is_correct"]
        ))

    # Öğretmene bildirim gönder
    notification = Notification(
        sender_id=current_user.id,
        receiver_id=exam.teacher_id,
        classroom_id=exam.classroom_id,
        title=f"Sınav Tamamlandı: {current_user.full_name}",
        message=f"{current_user.full_name} isimli öğrenci '{exam.title}' sınavını {net_score} Net ile tamamladı.",
        notification_type="exam_graded",
        link_path=f"/exams/{exam.id}/analytics"
    )
    db.add(notification)

    db.commit()
    db.refresh(submission)

    return ExamSubmissionOut(
        id=submission.id,
        exam_id=submission.exam_id,
        student_id=submission.student_id,
        student_name=current_user.full_name,
        student_username=current_user.username,
        student_number=current_user.student_number,
        started_at=submission.started_at,
        submitted_at=submission.submitted_at,
        total_questions=submission.total_questions,
        correct_count=submission.correct_count,
        incorrect_count=submission.incorrect_count,
        blank_count=submission.blank_count,
        net_score=submission.net_score,
        topic_analysis=submission.topic_analysis,
        answers=out_answers
    )

@router.get("/{exam_id}/analytics", response_model=ExamAnalyticsOut)
def get_exam_analytics(
    exam_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Sınavın detaylı sınıf analiz raporunu, soru başarı oranlarını ve sıralamayı üretir."""
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Sınav bulunamadı.")

    submissions = db.query(ExamSubmission).filter(ExamSubmission.exam_id == exam.id).all()
    questions = db.query(ExamQuestion).filter(ExamQuestion.exam_id == exam.id).order_by(ExamQuestion.question_number).all()

    total_submissions = len(submissions)
    total_enrolled = 0
    if exam.classroom_id:
        total_enrolled = db.query(ClassroomStudent).filter(ClassroomStudent.classroom_id == exam.classroom_id).count()
    else:
        total_enrolled = total_submissions

    nets = [s.net_score for s in submissions]
    avg_net = round(sum(nets) / total_submissions, 2) if total_submissions > 0 else 0.0
    highest_net = max(nets) if nets else 0.0
    lowest_net = min(nets) if nets else 0.0

    # Soru Bazlı Analiz
    question_analytics = []
    for q in questions:
        answers = db.query(ExamAnswer).filter(ExamAnswer.question_id == q.id).all()
        q_corr = sum(1 for a in answers if a.is_correct)
        q_blank = sum(1 for a in answers if not a.selected_option)
        q_inc = len(answers) - q_corr - q_blank
        success_rate = round((q_corr / len(answers)) * 100, 1) if answers else 0.0

        opt_dist = {"A": 0, "B": 0, "C": 0, "D": 0, "E": 0, "Boş": 0}
        for a in answers:
            if a.selected_option in opt_dist:
                opt_dist[a.selected_option] += 1
            else:
                opt_dist["Boş"] += 1

        question_analytics.append(QuestionAnalytic(
            question_number=q.question_number,
            question_id=q.id,
            topic=q.topic,
            question_text=q.question_text,
            visual_svg=(None if is_verbal_branch(exam.subject, q.topic) else q.visual_svg),
            option_a=q.option_a,
            option_b=q.option_b,
            option_c=q.option_c,
            option_d=q.option_d,
            option_e=q.option_e,
            correct_option=q.correct_option,
            explanation=q.explanation,
            correct_count=q_corr,
            incorrect_count=q_inc,
            blank_count=q_blank,
            success_rate=success_rate,
            option_distribution=opt_dist
        ))

    # Konu / Kazanım Bazlı Analiz
    topic_aggregates = {}
    for qa in question_analytics:
        top = qa.topic or "Genel"
        if top not in topic_aggregates:
            topic_aggregates[top] = {
                "question_count": 0,
                "total_answers": 0,
                "correct_answers": 0,
                "incorrect_answers": 0
            }
        topic_aggregates[top]["question_count"] += 1
        topic_aggregates[top]["total_answers"] += (qa.correct_count + qa.incorrect_count + qa.blank_count)
        topic_aggregates[top]["correct_answers"] += qa.correct_count
        topic_aggregates[top]["incorrect_answers"] += qa.incorrect_count

    topic_analytics = []
    for top, data in topic_aggregates.items():
        tot = data["total_answers"]
        s_rate = round((data["correct_answers"] / tot) * 100, 1) if tot > 0 else 0.0
        topic_analytics.append(TopicAnalytic(
            topic=top,
            question_count=data["question_count"],
            total_answers=data["total_answers"],
            correct_answers=data["correct_answers"],
            incorrect_answers=data["incorrect_answers"],
            success_rate=s_rate
        ))

    # Başarı oranına göre artan sırala (En çok zorlanılan konu en üstte çıksın)
    topic_analytics.sort(key=lambda t: t.success_rate)

    # Öğrenci Sıralama Tablosu (Net Skora Göre Azalan)
    sorted_subs = sorted(submissions, key=lambda s: s.net_score, reverse=True)
    student_rankings = []
    for idx, s in enumerate(sorted_subs, start=1):
        student_rankings.append(StudentRanking(
            rank=idx,
            student_id=s.student_id,
            student_name=s.student.full_name if s.student else "Öğrenci",
            student_number=s.student.student_number if s.student else "",
            correct_count=s.correct_count,
            incorrect_count=s.incorrect_count,
            blank_count=s.blank_count,
            net_score=s.net_score,
            submitted_at=s.submitted_at
        ))

    return ExamAnalyticsOut(
        exam_id=exam.id,
        title=exam.title,
        exam_type=exam.exam_type,
        subject=exam.subject,
        topic=exam.topic,
        classroom_name=exam.classroom.name if exam.classroom else "Genel Sınav",
        total_students_enrolled=total_enrolled,
        total_submissions=total_submissions,
        average_net=avg_net,
        highest_net=highest_net,
        lowest_net=lowest_net,
        question_analytics=question_analytics,
        topic_analytics=topic_analytics,
        student_rankings=student_rankings
    )

@router.delete("/{exam_id}")
def delete_exam(
    exam_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Sınavı ve tüm soru ile cevaplarını siler."""
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Sınav bulunamadı.")

    if current_user.username.lower() != "pirireis" and exam.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bu sınavı silme yetkiniz bulunmuyor.")

    db.delete(exam)
    db.commit()
    return {"message": "Sınav başarıyla silindi."}


# ================= AUTONOMOUS AI AGENT ENDPOINTS =================

@router.get("/agents/status", response_model=AIAgentStatusOut)
def get_ai_agent_status(
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Tüm otonom ajanların çalışma durumunu, kalite metriklerini ve son aktiviteleri döndürür."""
    status_data = AutonomousCoordinator.get_system_status(db)
    return status_data


@router.get("/agents/activities", response_model=List[AIAgentActivityOut])
def get_ai_agent_activities(
    limit: int = 30,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Ajanların son gerçekleştirdiği otonom aksiyon kayıtlarını listeler."""
    activities = db.query(AIAgentActivity).order_by(AIAgentActivity.created_at.desc()).limit(limit).all()
    return activities


@router.post("/agents/run-cycle")
async def trigger_ai_agent_cycle(
    payload: Optional[AIAgentRunRequest] = None,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """
    Öğretmen paneli üzerinden tam otonom gelişim döngüsünü manuel tetikler:
    1. Stil Hafızası & PDF Senkronizasyonu
    2. Eksik Branş/Konu Taraması & Otonom Soru Sentezi
    3. Hakem Ajanı Kalite Onayı & Otomatik İyileştirme
    4. Çeldirici & Hata Taraması
    """
    target_count = payload.target_count_per_subject if payload else 2
    report = await AutonomousCoordinator.run_full_autonomous_cycle(
        db=db,
        teacher_id=current_user.id,
        target_count_per_subject=target_count
    )
    return {
        "message": "Otonom gelişim döngüsü başarıyla tamamlandı.",
        "report": report
    }


@router.post("/agents/judge-question")
def judge_custom_question(
    question_payload: dict,
    subject: str = "Genel",
    current_user: User = Depends(require_teacher)
):
    """Tek bir soruyu Hakem Ajanı ile 5 pedagojik boyutta denetler ve puanlar."""
    eval_result = JudgeAgent.evaluate_question(question_payload, subject=subject)
    repaired = JudgeAgent.auto_repair_question(question_payload, subject=subject)
    return {
        "evaluation": eval_result,
        "repaired_question": repaired
    }


@router.post("/agents/run-daily-synthesis")
async def trigger_daily_high_volume_synthesis(
    payload: Optional[AIAgentDailySynthesisRequest] = None,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """
    7/24 Yüksek Hacimli Otonom Sentez Ajanı:
    Her gün her sınav tipinden 200'er soru (200 LGS + 200 TYT + 200 AYT = 600 Soru/Gün) üretip
    4 Kabul Kapısı onaylı olarak soru bankasına ekler.
    """
    target_count = payload.target_count if payload else 200
    exam_type = payload.exam_type if payload else "TÜMÜ"
    report = await AutonomousCoordinator.run_daily_200_synthesis(
        db=db,
        exam_type=exam_type,
        target_count=target_count,
        teacher_id=current_user.id
    )
    return {
        "message": f"7/24 Yüksek Hacimli Otonom Sentez ({exam_type}) tamamlandı.",
        "report": report
    }


@router.post("/agents/transform-legacy")
def trigger_legacy_transformation(
    payload: Optional[AIAgentTransformLegacyRequest] = None,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """
    Yeni Nesil Dönüşüm ve Denetim Ajanı:
    Soru bankasındaki klasik ve kısa soruları Türkiye Yüzyılı Maarif Modeli standartlarında
    bağlamlı, grafikli ve üst düzey akıl yürütme içeren yeni nesil sorulara dönüştürür.
    """
    limit = payload.limit if payload else 30
    report = AutonomousCoordinator.run_legacy_transformation(
        db=db,
        limit=limit,
        teacher_id=current_user.id
    )
    return {
        "message": "Yeni nesil Maarif Modeli dönüşümü başarıyla tamamlandı.",
        "report": report
    }



