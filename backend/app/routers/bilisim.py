# -*- coding: utf-8 -*-
"""
Torbalı Piri Reis MTAL Bilişim Teknolojileri Alanı
Bilişim Dersleri, Yıllık Plan & Ders Materyali AI Router'ı
"""

import os
import uuid
import json
import aiofiles
from datetime import datetime
from typing import List, Optional, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import get_db, BASE_DIR
from app.models import User, BilisimCourse, BilisimPlan, BilisimModuleDoc, BilisimWeeklyMaterial
from app.schemas import (
    BilisimCourseCreate, BilisimCourseOut, BilisimPlanTextUpdate,
    BilisimModuleDocOut, BilisimWeeklyMaterialOut, BilisimGenerateRequest
)
from app.auth import get_current_user, require_teacher
from app.services.bilisim_ai_service import (
    calculate_academic_week, extract_text_from_file,
    parse_annual_plan_text, STARTER_CURRICULUMS,
    generate_weekly_bilisim_material, build_pptx_presentation
)

router = APIRouter(prefix="/api/bilisim", tags=["Bilisim AI"])

UPLOADS_PLAN_DIR = os.path.join(BASE_DIR, "uploads", "curriculum")
UPLOADS_MODULE_DIR = os.path.join(BASE_DIR, "uploads", "modules")
UPLOADS_PPTX_DIR = os.path.join(BASE_DIR, "uploads", "presentations")

os.makedirs(UPLOADS_PLAN_DIR, exist_ok=True)
os.makedirs(UPLOADS_MODULE_DIR, exist_ok=True)
os.makedirs(UPLOADS_PPTX_DIR, exist_ok=True)

# ================= 1. GÜNCEL AKADEMİK HAFTA & ŞABLONLAR =================

@router.get("/current-week")
def get_current_week_info():
    """Bugünün tarihine göre güncel MEB eğitim-öğretim haftasını döndürür."""
    return calculate_academic_week()

@router.get("/starter-templates")
def get_starter_templates():
    """Hemen kullanılabilecek hazır Bilişim dersi şablonlarını listeler."""
    return [
        {
            "id": k,
            "name": v["name"],
            "grade_level": v["grade_level"],
            "description": v["description"],
            "weeks_count": len(v["weeks"])
        }
        for k, v in STARTER_CURRICULUMS.items()
    ]

# ================= 2. DERS YÖNETİMİ =================

@router.get("/courses")
def list_courses(
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Öğretmenin Bilişim derslerini listeler."""
    query = db.query(BilisimCourse)
    if current_user.username.lower() != "pirireis":
        query = query.filter(BilisimCourse.teacher_id == current_user.id)

    courses = query.order_by(BilisimCourse.created_at.desc()).all()
    week_info = calculate_academic_week()
    cur_week = week_info["current_week"]

    result = []
    for c in courses:
        plan = db.query(BilisimPlan).filter(BilisimPlan.course_id == c.id).first()
        mod_count = db.query(BilisimModuleDoc).filter(BilisimModuleDoc.course_id == c.id).count()

        result.append({
            "id": c.id,
            "name": c.name,
            "grade_level": c.grade_level,
            "academic_year": c.academic_year,
            "start_date": c.start_date,
            "description": c.description,
            "created_at": c.created_at,
            "has_plan": plan is not None,
            "plan_filename": plan.filename if plan else None,
            "modules_count": mod_count,
            "current_week": cur_week,
            "total_weeks": 36
        })

    return result

@router.post("/courses")
def create_course(
    course_in: BilisimCourseCreate,
    starter_key: Optional[str] = None,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Yeni bir Bilişim dersi oluşturur. İsteğe bağlı olarak hazır şablonla başlatır."""
    new_c = BilisimCourse(
        teacher_id=current_user.id,
        name=course_in.name,
        grade_level=course_in.grade_level or "11. Sınıf",
        academic_year=course_in.academic_year or "2026-2027",
        description=course_in.description
    )
    db.add(new_c)
    db.commit()
    db.refresh(new_c)

    # Eğer hazır şablon seçilmişse veya isme uygunsa yıllık planı otomatik doldur
    template_to_use = None
    if starter_key and starter_key in STARTER_CURRICULUMS:
        template_to_use = STARTER_CURRICULUMS[starter_key]
    else:
        lower_name = course_in.name.lower()
        if "mobil" in lower_name or "android" in lower_name:
            template_to_use = STARTER_CURRICULUMS["mobil_uygulama"]
        elif "web" in lower_name:
            template_to_use = STARTER_CURRICULUMS["web_programlama"]
        elif "nesne" in lower_name:
            template_to_use = STARTER_CURRICULUMS["nesne_tabanli"]

    if template_to_use:
        weeks = template_to_use["weeks"]
        # Metin özeti oluştur
        raw_lines = [f"{w['week']}. Hafta: {w['topic']} - {w['outcomes']}" for w in weeks]
        plan = BilisimPlan(
            course_id=new_c.id,
            filename=f"MEB_{starter_key or 'hazir'}_yillik_plan.txt",
            raw_content="\n".join(raw_lines),
            parsed_weeks=json.dumps(weeks, ensure_ascii=False)
        )
        db.add(plan)
        db.commit()

    return {"message": "Ders başarıyla oluşturuldu.", "course_id": new_c.id}

@router.delete("/courses/{course_id}")
def delete_course(
    course_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Bilişim dersini ve ona bağlı plan, modül ve materyalleri siler."""
    course = db.query(BilisimCourse).filter(BilisimCourse.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Ders bulunamadı.")

    if current_user.username.lower() != "pirireis" and course.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bu dersi silme yetkiniz yok.")

    db.delete(course)
    db.commit()
    return {"message": "Ders ve ilişkili tüm içerikler başarıyla silindi."}

# ================= 3. YILLIK PLAN YÖNETİMİ =================

@router.get("/courses/{course_id}/plan")
def get_course_plan(
    course_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Dersin kayıtlı yıllık planını ve 36 haftalık ayrıştırılmış konularını getirir."""
    course = db.query(BilisimCourse).filter(BilisimCourse.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Ders bulunamadı.")

    plan = db.query(BilisimPlan).filter(BilisimPlan.course_id == course_id).first()
    week_info = calculate_academic_week()

    if not plan:
        # Plan yoksa varsayılan taslak döndür
        default_weeks = parse_annual_plan_text("", course.name)
        return {
            "has_plan": False,
            "course_id": course_id,
            "filename": None,
            "raw_content": "",
            "parsed_weeks": default_weeks,
            "current_week": week_info["current_week"],
            "date_range_str": week_info["date_range_str"]
        }

    parsed = []
    if plan.parsed_weeks:
        try:
            parsed = json.loads(plan.parsed_weeks)
        except Exception:
            parsed = parse_annual_plan_text(plan.raw_content or "", course.name)

    return {
        "has_plan": True,
        "course_id": course_id,
        "filename": plan.filename,
        "raw_content": plan.raw_content,
        "parsed_weeks": parsed,
        "uploaded_at": plan.uploaded_at,
        "current_week": week_info["current_week"],
        "date_range_str": week_info["date_range_str"]
    }

@router.post("/courses/{course_id}/plan")
async def upload_course_plan(
    course_id: int,
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None),
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """
    Ders için yıllık plan yükler (PDF, DOCX, XLSX, TXT) veya formdan yapıştırılan metni kaydeder.
    Metni otomatik ayrıştırıp 36 haftalık takvime döker.
    """
    try:
        course = db.query(BilisimCourse).filter(BilisimCourse.id == course_id).first()
        if not course:
            raise HTTPException(status_code=404, detail="Ders bulunamadı.")

        extracted_content = ""
        saved_filename = "manuel_plan_metni.txt"
        file_path = None

        if file and file.filename:
            ext = os.path.splitext(file.filename)[1].lower()
            unique_name = f"plan_{course_id}_{uuid.uuid4().hex[:8]}{ext}"
            file_path = os.path.join(UPLOADS_PLAN_DIR, unique_name)
            saved_filename = file.filename

            content_bytes = await file.read()
            async with aiofiles.open(file_path, "wb") as f:
                await f.write(content_bytes)

            extracted_content, _ = extract_text_from_file(file_path, file.filename)
        elif raw_text:
            extracted_content = raw_text.strip()
        else:
            raise HTTPException(status_code=400, detail="Lütfen bir yıllık plan dosyası yükleyin veya metin girin.")

        # PostgreSQL Güvenliği: NUL byte ve aşırı uzunluk temizliği
        clean_content = (extracted_content or "").replace("\x00", "")[:300000]
        clean_filename = (saved_filename or "").replace("\x00", "")

        # 36 haftalık yapıya ayrıştır
        parsed_weeks = parse_annual_plan_text(clean_content, course.name)
        clean_weeks_json = json.dumps(parsed_weeks, ensure_ascii=False).replace("\x00", "")

        # Mevcut planı güncelle veya yenisini oluştur
        plan = db.query(BilisimPlan).filter(BilisimPlan.course_id == course_id).first()
        if plan:
            plan.filename = clean_filename
            plan.file_path = file_path
            plan.raw_content = clean_content
            plan.parsed_weeks = clean_weeks_json
            plan.uploaded_at = datetime.utcnow()
        else:
            plan = BilisimPlan(
                course_id=course_id,
                filename=clean_filename,
                file_path=file_path,
                raw_content=clean_content,
                parsed_weeks=clean_weeks_json
            )
            db.add(plan)

        db.commit()
        return {
            "message": f"Yıllık plan başarıyla yüklendi ve {len(parsed_weeks)} haftalık müfredat çıkarıldı.",
            "parsed_weeks_count": len(parsed_weeks)
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"[Bilisim Upload Plan Error] {e}")
        raise HTTPException(status_code=400, detail=f"Plan yüklenirken hata oluştu: {str(e)}")

# ================= 4. MEB DERS MODÜLLERİ DEPOSU =================

@router.get("/courses/{course_id}/modules")
def list_course_modules(
    course_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Derse ait yüklenmiş MEB ders modüllerini listeler."""
    modules = db.query(BilisimModuleDoc).filter(
        BilisimModuleDoc.course_id == course_id
    ).order_by(BilisimModuleDoc.uploaded_at.desc()).all()

    return [
        {
            "id": m.id,
            "title": m.title,
            "filename": m.filename,
            "file_size_kb": m.file_size_kb,
            "page_count": m.page_count,
            "summary": m.summary,
            "uploaded_at": m.uploaded_at
        }
        for m in modules
    ]

@router.post("/courses/{course_id}/modules")
async def upload_course_module(
    course_id: int,
    title: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """MEB ders modülü (PDF/Doküman) yükler ve metnini indeksler."""
    try:
        course = db.query(BilisimCourse).filter(BilisimCourse.id == course_id).first()
        if not course:
            raise HTTPException(status_code=404, detail="Ders bulunamadı.")

        ext = os.path.splitext(file.filename)[1].lower()
        unique_name = f"mod_{course_id}_{uuid.uuid4().hex[:8]}{ext}"
        file_path = os.path.join(UPLOADS_MODULE_DIR, unique_name)

        content_bytes = await file.read()
        file_size_kb = len(content_bytes) // 1024

        async with aiofiles.open(file_path, "wb") as f:
            await f.write(content_bytes)

        extracted_text, page_count = extract_text_from_file(file_path, file.filename)
        clean_mod_text = (extracted_text or "").replace("\x00", "")[:300000]
        summary_preview = (clean_mod_text[:300].replace("\n", " ").strip() if clean_mod_text else "Metin ayrıştırılamadı.").replace("\x00", "")
        clean_title = (title or file.filename).strip().replace("\x00", "")

        mod_doc = BilisimModuleDoc(
            course_id=course_id,
            title=clean_title,
            filename=file.filename.replace("\x00", ""),
            file_path=file_path,
            file_size_kb=file_size_kb,
            page_count=page_count,
            extracted_text=clean_mod_text,
            summary=summary_preview
        )
        db.add(mod_doc)
        db.commit()
        db.refresh(mod_doc)

        return {
            "message": f"'{clean_title}' modülü başarıyla yüklendi ({page_count} sayfa).",
            "module_id": mod_doc.id
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"[Bilisim Upload Module Error] {e}")
        raise HTTPException(status_code=400, detail=f"Modül yüklenirken hata oluştu: {str(e)}")

@router.delete("/courses/{course_id}/modules/{module_id}")
def delete_course_module(
    course_id: int,
    module_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Yüklenmiş modül belgesini siler."""
    mod = db.query(BilisimModuleDoc).filter(
        BilisimModuleDoc.id == module_id,
        BilisimModuleDoc.course_id == course_id
    ).first()
    if not mod:
        raise HTTPException(status_code=404, detail="Modül bulunamadı.")

    if mod.file_path and os.path.exists(mod.file_path):
        try:
            os.remove(mod.file_path)
        except Exception:
            pass

    db.delete(mod)
    db.commit()
    return {"message": "Modül başarıyla silindi."}

# ================= 5. AI MATERYAL & SUNUM (.PPTX) ÜRETİMİ =================

@router.get("/courses/{course_id}/materials/{week_number}")
def get_weekly_material(
    course_id: int,
    week_number: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Belirtilen hafta için daha önce üretilmiş materyalleri döndürür."""
    mat = db.query(BilisimWeeklyMaterial).filter(
        BilisimWeeklyMaterial.course_id == course_id,
        BilisimWeeklyMaterial.week_number == week_number
    ).first()

    if not mat:
        return {"exists": False, "week_number": week_number}

    return {
        "exists": True,
        "id": mat.id,
        "course_id": mat.course_id,
        "week_number": mat.week_number,
        "topic": mat.topic,
        "subtopics": json.loads(mat.subtopics) if mat.subtopics else [],
        "learning_outcomes": json.loads(mat.learning_outcomes) if mat.learning_outcomes else [],
        "teaching_guide": json.loads(mat.teaching_guide) if mat.teaching_guide else {},
        "code_examples": json.loads(mat.code_examples) if mat.code_examples else [],
        "lab_exercises": json.loads(mat.lab_exercises) if mat.lab_exercises else {},
        "quiz_questions": json.loads(mat.quiz_questions) if mat.quiz_questions else [],
        "slides": json.loads(mat.slides_json) if mat.slides_json else [],
        "pptx_file_path": mat.pptx_file_path,
        "download_url": f"/api/bilisim/download-presentation/{mat.id}" if mat.pptx_file_path else None,
        "updated_at": mat.updated_at
    }

@router.post("/courses/{course_id}/generate/{week_number}")
async def generate_material_for_week(
    course_id: int,
    week_number: int,
    req: Optional[BilisimGenerateRequest] = None,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """
    Belirtilen hafta için Yapay Zeka ile:
    1. Kod ve Uygulama Örnekleri
    2. Öğrenci Laboratuvar Görevi
    3. Ders Akış Kılavuzu & Öğretmen Notu
    4. Sınıf İçi Pekiştirme Soruları
    5. python-pptx ile İndirilebilir 16:9 Geniş Ekran PowerPoint (.pptx) Sunusu
    üretir.
    """
    course = db.query(BilisimCourse).filter(BilisimCourse.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Ders bulunamadı.")

    # 1. Konuyu yıllık plandan bul
    topic = f"{week_number}. Hafta Bilişim Dersi"
    outcomes = f"{week_number}. Hafta MEB Bilişim ders kazanımları."
    plan = db.query(BilisimPlan).filter(BilisimPlan.course_id == course_id).first()

    if plan and plan.parsed_weeks:
        try:
            weeks_list = json.loads(plan.parsed_weeks)
            for w in weeks_list:
                if w.get("week") == week_number:
                    topic = w.get("topic", topic)
                    outcomes = w.get("outcomes", outcomes)
                    break
        except Exception:
            pass

    if req and req.selected_topic:
        topic = req.selected_topic

    # 2. Modüllerden özet topla
    modules = db.query(BilisimModuleDoc).filter(BilisimModuleDoc.course_id == course_id).all()
    mod_texts = []
    for m in modules[:3]:
        if m.extracted_text:
            mod_texts.append(f"[{m.title}]: {m.extracted_text[:1500]}")
    combined_mod_text = "\n\n".join(mod_texts)

    custom_instructions = req.custom_instructions if req else None

    # 3. AI ile materyali üret
    generated = await generate_weekly_bilisim_material(
        course_name=course.name,
        grade_level=course.grade_level,
        week_number=week_number,
        topic=topic,
        outcomes=outcomes,
        module_summaries=combined_mod_text,
        custom_prompt=custom_instructions
    )

    # 4. python-pptx ile PowerPoint dosyasını oluştur
    pptx_filename = f"PiriReis_Hafta_{week_number}_{uuid.uuid4().hex[:6]}.pptx"
    pptx_full_path = os.path.join(UPLOADS_PPTX_DIR, pptx_filename)
    relative_pptx_url = f"/uploads/presentations/{pptx_filename}"

    try:
        build_pptx_presentation(
            material_data=generated,
            course_name=course.name,
            week_number=week_number,
            output_path=pptx_full_path
        )
    except Exception as err:
        print(f"[Bilisim AI] PPTX oluşturma uyarısı: {err}")
        relative_pptx_url = None

    # 5. Veritabanına kaydet veya güncelle
    mat = db.query(BilisimWeeklyMaterial).filter(
        BilisimWeeklyMaterial.course_id == course_id,
        BilisimWeeklyMaterial.week_number == week_number
    ).first()

    if not mat:
        mat = BilisimWeeklyMaterial(
            course_id=course_id,
            week_number=week_number,
            topic=generated.get("topic", topic),
            subtopics=json.dumps(generated.get("subtopics", []), ensure_ascii=False),
            learning_outcomes=json.dumps(generated.get("learning_outcomes", []), ensure_ascii=False),
            teaching_guide=json.dumps(generated.get("teaching_guide", {}), ensure_ascii=False),
            code_examples=json.dumps(generated.get("code_examples", []), ensure_ascii=False),
            lab_exercises=json.dumps(generated.get("lab_exercises", {}), ensure_ascii=False),
            quiz_questions=json.dumps(generated.get("quiz_questions", []), ensure_ascii=False),
            slides_json=json.dumps(generated.get("slides", []), ensure_ascii=False),
            pptx_file_path=relative_pptx_url
        )
        db.add(mat)
    else:
        mat.topic = generated.get("topic", topic)
        mat.subtopics = json.dumps(generated.get("subtopics", []), ensure_ascii=False)
        mat.learning_outcomes = json.dumps(generated.get("learning_outcomes", []), ensure_ascii=False)
        mat.teaching_guide = json.dumps(generated.get("teaching_guide", {}), ensure_ascii=False)
        mat.code_examples = json.dumps(generated.get("code_examples", []), ensure_ascii=False)
        mat.lab_exercises = json.dumps(generated.get("lab_exercises", {}), ensure_ascii=False)
        mat.quiz_questions = json.dumps(generated.get("quiz_questions", []), ensure_ascii=False)
        mat.slides_json = json.dumps(generated.get("slides", []), ensure_ascii=False)
        mat.pptx_file_path = relative_pptx_url
        mat.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(mat)

    return {
        "message": f"{week_number}. Hafta materyalleri ve PowerPoint sunumu başarıyla oluşturuldu!",
        "material_id": mat.id,
        "week_number": week_number,
        "topic": mat.topic,
        "download_url": f"/api/bilisim/download-presentation/{mat.id}" if mat.pptx_file_path else None
    }

# ================= 6. PPTX SUNUM İNDİRME =================

@router.get("/download-presentation/{material_id}")
def download_presentation(
    material_id: int,
    db: Session = Depends(get_db)
):
    """Oluşturulan PowerPoint (.pptx) sunum dosyasını indirir."""
    mat = db.query(BilisimWeeklyMaterial).filter(BilisimWeeklyMaterial.id == material_id).first()
    if not mat or not mat.pptx_file_path:
        raise HTTPException(status_code=404, detail="Sunum dosyası bulunamadı.")

    # Göreceli yoldan tam yola çevir
    clean_path = mat.pptx_file_path.replace("/uploads/", "").replace("\\", "/")
    full_path = os.path.join(BASE_DIR, "uploads", clean_path)

    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail="Sunum dosyası diskte bulunamadı.")

    filename = f"{mat.topic.replace(' ', '_')[:35]}_Hafta_{mat.week_number}_Sunusu.pptx"

    return FileResponse(
        path=full_path,
        filename=filename,
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )

