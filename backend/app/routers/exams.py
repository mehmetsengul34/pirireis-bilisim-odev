import json
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Classroom, ClassroomStudent, Exam, ExamQuestion, ExamSubmission, ExamAnswer, Notification
from app.schemas import (
    ExamOut, ExamDetailOut, ExamCreateRequest, GenerateQuestionsRequest,
    ExamSubmitRequest, ExamSubmissionOut, ExamAnalyticsOut, QuestionAnalytic,
    TopicAnalytic, StudentRanking, ExamQuestionStudentOut, ExamQuestionOut, ExamAnswerOut
)
from app.auth import get_current_user, require_teacher
from app.services.ai_exam_service import YKS_CURRICULUM, generate_questions_smart

router = APIRouter(prefix="/api/exams", tags=["exams"])

@router.get("/curriculum")
def get_curriculum():
    """YKS TYT ve AYT güncel müfredat ve konu listesini döndürür."""
    return YKS_CURRICULUM

@router.post("/generate-questions")
async def generate_questions_endpoint(
    req: GenerateQuestionsRequest,
    current_user: User = Depends(require_teacher)
):
    """Yapay Zeka (Gemini AI / Müfredat Motoru) ile yeni nesil sorular üretir."""
    try:
        questions = await generate_questions_smart(
            exam_type=req.exam_type,
            subject=req.subject,
            topic=req.topic,
            difficulty=req.difficulty,
            question_count=req.question_count,
            include_diagrams=req.include_diagrams,
            custom_prompt=req.custom_prompt,
            api_key=req.gemini_api_key
        )
        return {"questions": questions}
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

    # Soruları ekle
    for q in req.questions:
        question = ExamQuestion(
            exam_id=exam.id,
            question_number=q.question_number,
            question_text=q.question_text,
            visual_svg=q.visual_svg,
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
                visual_svg=q.visual_svg,
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
                visual_svg=q.visual_svg,
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
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Sınav bulunamadı.")

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
            correct_option=q.correct_option,
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
