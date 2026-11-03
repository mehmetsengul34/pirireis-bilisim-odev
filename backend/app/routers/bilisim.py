# -*- coding: utf-8 -*-
"""
Torbalı Piri Reis MTAL Bilişim Teknolojileri Alanı
Bilişim Dersleri, Yıllık Plan & Ders Materyali AI Router'ı
"""

import os
import re
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
    generate_weekly_bilisim_material, build_pptx_presentation,
    detect_course_info_from_plan, build_docx_daily_plan,
    build_docx_topic_example, generate_procedural_bilisim_material,
    generate_topic_visual_mockup
)

router = APIRouter(prefix="/api/bilisim", tags=["Bilisim AI"])

UPLOADS_PLAN_DIR = os.path.join(BASE_DIR, "uploads", "curriculum")
UPLOADS_MODULE_DIR = os.path.join(BASE_DIR, "uploads", "modules")
UPLOADS_PPTX_DIR = os.path.join(BASE_DIR, "uploads", "presentations")
UPLOADS_DOCX_DIR = os.path.join(BASE_DIR, "uploads", "documents")
UPLOADS_IMAGES_DIR = os.path.join(BASE_DIR, "uploads", "images")

os.makedirs(UPLOADS_PLAN_DIR, exist_ok=True)
os.makedirs(UPLOADS_MODULE_DIR, exist_ok=True)
os.makedirs(UPLOADS_PPTX_DIR, exist_ok=True)
os.makedirs(UPLOADS_DOCX_DIR, exist_ok=True)
os.makedirs(UPLOADS_IMAGES_DIR, exist_ok=True)

def to_safe_ascii_filename(text: str) -> str:
    """Türkçe karakterleri ASCII'ye dönüştürerek HTTP başlıklarında güvenli dosya ismi üretir."""
    if not text:
        return "Bilisim_Dersi"
    tr_map = str.maketrans("çğışöüÇĞİŞÖÜ", "cgisouCGISOU")
    ascii_text = text.translate(tr_map)
    clean = re.sub(r'[^a-zA-Z0-9_\-]', '_', ascii_text)
    clean = re.sub(r'_+', '_', clean).strip('_')
    return clean[:30] or "Bilisim_Dersi"

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

def ensure_default_bilisim_courses(db: Session, teacher_id: int):
    """
    Bilişim Alanı temel derslerini ve yıllık planlarını kontrol eder.
    Eğer Course 1'de Grafik ve Canlandırma planı varsa ders adını günceller.
    Standart MEB Bilişim dersleri eksikse hazır 36 haftalık planlarıyla oluşturur.
    """
    try:
        # 1. Mevcut dersleri kontrol et: Eğer Course 1'in planı varsa adını doğru ata
        c1 = db.query(BilisimCourse).filter(BilisimCourse.id == 1).first()
        p1 = db.query(BilisimPlan).filter(BilisimPlan.course_id == 1).first()
        if c1 and p1:
            info = detect_course_info_from_plan(p1.filename or "", p1.raw_content or "")
            if info.get("name") and info["name"] != c1.name:
                c1.name = info["name"]
                c1.grade_level = info.get("grade_level", c1.grade_level)
                db.commit()

        # 2. Standart dersler
        defaults = [
            ("grafik_canlandirma", "Grafik ve Canlandırma", "11. Sınıf"),
            ("mobil_uygulama", "Mobil Uygulama Geliştirme (Android Studio & Java)", "11. Sınıf"),
            ("web_programlama", "Web Tabanlı Uygulama Geliştirme (React & JS)", "11. Sınıf"),
            ("nesne_tabanli", "Nesne Tabanlı Programlama (C# / Python)", "11. Sınıf"),
        ]

        for key, name, grade in defaults:
            exists = db.query(BilisimCourse).filter(
                BilisimCourse.name.ilike(f"%{name[:10]}%")
            ).first()
            if not exists and key in STARTER_CURRICULUMS:
                new_c = BilisimCourse(
                    teacher_id=teacher_id,
                    name=name,
                    grade_level=grade,
                    academic_year="2026-2027",
                    description=STARTER_CURRICULUMS[key]["description"]
                )
                db.add(new_c)
                db.commit()
                db.refresh(new_c)

                weeks = STARTER_CURRICULUMS[key]["weeks"]
                raw_lines = [f"{w['week']}. Hafta: {w['topic']} - {w['outcomes']}" for w in weeks]
                plan = BilisimPlan(
                    course_id=new_c.id,
                    filename=f"MEB_{key}_yillik_plan.txt",
                    raw_content="\n".join(raw_lines),
                    parsed_weeks=json.dumps(weeks, ensure_ascii=False)
                )
                db.add(plan)
                db.commit()
    except Exception as e:
        db.rollback()
        print(f"[Ensure Bilisim Courses Error] {e}")

@router.get("/courses")
def list_courses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Bilişim Alanı'ndaki tüm yıllık planları ve dersleri listeler (öğretmen ve öğrenciler için)."""
    if current_user.role == "teacher":
        ensure_default_bilisim_courses(db, current_user.id)
    courses = db.query(BilisimCourse).order_by(BilisimCourse.id.asc()).all()
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

        # Plandan ders adı, sınıf seviyesi ve öğretim yılını tespit et ve dersi güncelle
        info = detect_course_info_from_plan(clean_filename, clean_content)
        detected_name = info.get("name")
        detected_grade = info.get("grade_level")
        if detected_name and len(detected_name) >= 3:
            course.name = detected_name
        if detected_grade:
            course.grade_level = detected_grade
        if info.get("academic_year"):
            course.academic_year = info.get("academic_year")

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
            "message": f"'{course.name}' yıllık planı başarıyla yüklendi ve {len(parsed_weeks)} haftalık müfredat çıkarıldı.",
            "course_id": course.id,
            "course_name": course.name,
            "grade_level": course.grade_level,
            "parsed_weeks_count": len(parsed_weeks)
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"[Bilisim Upload Plan Error] {e}")
        raise HTTPException(status_code=400, detail=f"Plan yüklenirken hata oluştu: {str(e)}")

@router.post("/upload-new-plan")
async def upload_new_course_plan(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None),
    custom_name: Optional[str] = Form(None),
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """
    Doğrudan yeni bir yıllık plan dosyası yükler (PDF, DOCX, XLSX, TXT) veya formdan yapıştırılan metni kaydeder.
    Belgeden ders adını ve sınıfını otomatik tespit eder, yeni bir Bilişim dersi oluşturur
    (veya aynı isimli ders varsa onu günceller), 36 haftalık müfredatı bağlar ve ders listesine ekler.
    """
    try:
        extracted_content = ""
        saved_filename = "yillik_plan.txt"
        file_path = None

        unique_prefix = uuid.uuid4().hex[:8]

        if file and file.filename:
            ext = os.path.splitext(file.filename)[1].lower()
            unique_name = f"newplan_{unique_prefix}{ext}"
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

        clean_content = (extracted_content or "").replace("\x00", "")[:300000]
        clean_filename = (saved_filename or "").replace("\x00", "")

        # Plandan ders adı, sınıf seviyesi ve öğretim yılını tespit et
        info = detect_course_info_from_plan(clean_filename, clean_content)
        detected_name = custom_name.strip() if custom_name and custom_name.strip() else info.get("name", "Yeni Bilişim Dersi")
        grade_level = info.get("grade_level", "11. Sınıf")
        academic_year = info.get("academic_year", "2026-2027")

        # Aynı isimde mevcut ders var mı kontrol et
        existing_course = db.query(BilisimCourse).filter(
            BilisimCourse.name.ilike(detected_name)
        ).first()

        if existing_course:
            course = existing_course
            course.grade_level = grade_level
            course.academic_year = academic_year
        else:
            course = BilisimCourse(
                teacher_id=current_user.id,
                name=detected_name,
                grade_level=grade_level,
                academic_year=academic_year,
                description=f"'{clean_filename}' yıllık planından otomatik oluşturulan ders."
            )
            db.add(course)
            db.commit()
            db.refresh(course)

        # 36 haftalık yapıya ayrıştır
        parsed_weeks = parse_annual_plan_text(clean_content, course.name)
        clean_weeks_json = json.dumps(parsed_weeks, ensure_ascii=False).replace("\x00", "")

        plan = db.query(BilisimPlan).filter(BilisimPlan.course_id == course.id).first()
        if plan:
            plan.filename = clean_filename
            plan.file_path = file_path
            plan.raw_content = clean_content
            plan.parsed_weeks = clean_weeks_json
            plan.uploaded_at = datetime.utcnow()
        else:
            plan = BilisimPlan(
                course_id=course.id,
                filename=clean_filename,
                file_path=file_path,
                raw_content=clean_content,
                parsed_weeks=clean_weeks_json
            )
            db.add(plan)

        db.commit()
        return {
            "message": f"'{course.name}' ({course.grade_level}) dersi başarıyla eklendi ve {len(parsed_weeks)} haftalık müfredatı hazırlandı.",
            "course_id": course.id,
            "course_name": course.name,
            "grade_level": course.grade_level,
            "parsed_weeks_count": len(parsed_weeks)
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"[Bilisim Upload New Plan Error] {e}")
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

        # Modül başlığından veya dosya adından ders adı tespiti kontrolü
        info = detect_course_info_from_plan(file.filename, clean_mod_text)
        detected_name = info.get("name")
        if detected_name and ("dersi" in course.name.lower() or "yeni" in course.name.lower()):
            course.name = detected_name
            db.commit()

        return {
            "message": f"'{clean_title}' modülü başarıyla yüklendi ({page_count} sayfa).",
            "module_id": mod_doc.id,
            "course_id": course.id,
            "course_name": course.name
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"[Bilisim Upload Module Error] {e}")
        raise HTTPException(status_code=400, detail=f"Modül yüklenirken hata oluştu: {str(e)}")

@router.post("/upload-new-module")
async def upload_new_course_module(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    custom_course_name: Optional[str] = Form(None),
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """
    Doğrudan yeni bir MEB ders modülü yükler. Belgeden ders adını tespit eder,
    dersi otomatik oluşturur (veya mevcutsa bağlar) ve modülü kaydeder.
    """
    try:
        ext = os.path.splitext(file.filename)[1].lower()
        unique_name = f"newmod_{uuid.uuid4().hex[:8]}{ext}"
        file_path = os.path.join(UPLOADS_MODULE_DIR, unique_name)

        content_bytes = await file.read()
        file_size_kb = len(content_bytes) // 1024

        async with aiofiles.open(file_path, "wb") as f:
            await f.write(content_bytes)

        extracted_text, page_count = extract_text_from_file(file_path, file.filename)
        clean_mod_text = (extracted_text or "").replace("\x00", "")[:300000]
        summary_preview = (clean_mod_text[:300].replace("\n", " ").strip() if clean_mod_text else "Metin ayrıştırılamadı.").replace("\x00", "")
        clean_title = (title or file.filename).strip().replace("\x00", "")

        info = detect_course_info_from_plan(file.filename, clean_mod_text)
        course_name = (custom_course_name or info.get("name") or clean_title).strip()
        grade_level = info.get("grade_level", "11. Sınıf")

        existing_course = db.query(BilisimCourse).filter(
            BilisimCourse.name.ilike(course_name)
        ).first()

        if existing_course:
            course = existing_course
        else:
            course = BilisimCourse(
                teacher_id=current_user.id,
                name=course_name,
                grade_level=grade_level,
                academic_year="2026-2027",
                description=f"'{clean_title}' modülünden otomatik oluşturulan ders."
            )
            db.add(course)
            db.commit()
            db.refresh(course)

        mod_doc = BilisimModuleDoc(
            course_id=course.id,
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
            "message": f"'{course.name}' ({course.grade_level}) dersine '{clean_title}' modülü başarıyla eklendi.",
            "course_id": course.id,
            "course_name": course.name,
            "grade_level": course.grade_level,
            "module_id": mod_doc.id
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"[Bilisim Upload New Module Error] {e}")
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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Belirtilen hafta için üretilmiş ders materyallerini, konu örneğini ve sunuyu döndürür."""
    course = db.query(BilisimCourse).filter(BilisimCourse.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Ders bulunamadı.")

    mat = db.query(BilisimWeeklyMaterial).filter(
        BilisimWeeklyMaterial.course_id == course_id,
        BilisimWeeklyMaterial.week_number == week_number
    ).first()

    # Öğrenci veya öğretmen için materyal henüz üretilmemişse anında prosedürel motor ile hazırla
    if not mat:
        topic = f"{week_number}. Hafta {course.name} Dersi"
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

        procedural = generate_procedural_bilisim_material(
            course_name=course.name,
            grade_level=course.grade_level,
            week_number=week_number,
            topic=topic,
            outcomes=outcomes
        )

        mat = BilisimWeeklyMaterial(
            course_id=course_id,
            week_number=week_number,
            topic=procedural.get("topic", topic),
            subtopics=json.dumps(procedural.get("subtopics", []), ensure_ascii=False),
            learning_outcomes=json.dumps(procedural.get("learning_outcomes", []), ensure_ascii=False),
            teaching_guide=json.dumps(procedural.get("teaching_guide", {}), ensure_ascii=False),
            code_examples=json.dumps(procedural.get("code_examples", []), ensure_ascii=False),
            lab_exercises=json.dumps(procedural.get("lab_exercises", {}), ensure_ascii=False),
            quiz_questions=json.dumps(procedural.get("quiz_questions", []), ensure_ascii=False),
            slides_json=json.dumps(procedural.get("slides", []), ensure_ascii=False)
        )
        db.add(mat)
        db.commit()
        db.refresh(mat)

    guide = json.loads(mat.teaching_guide) if mat.teaching_guide else {}
    daily_plan = guide.get("daily_plan") or {}
    unit_questions = guide.get("unit_questions") or []

    # Canlı konu örneği ve arayüz görselini hazırla
    visual_filename = f"visual_Hafta_{mat.week_number}_{mat.id}.png"
    visual_path = os.path.join(UPLOADS_IMAGES_DIR, visual_filename)
    if not os.path.exists(visual_path):
        code_list = json.loads(mat.code_examples) if mat.code_examples else []
        first_code = code_list[0].get("code", "") if code_list else ""
        try:
            generate_topic_visual_mockup(
                course_name=course.name,
                topic=mat.topic,
                code_snippet=first_code,
                output_path=visual_path
            )
        except Exception as v_err:
            print(f"[Visual Generation Warning] {v_err}")

    visual_url = f"/uploads/images/{visual_filename}" if os.path.exists(visual_path) else None

    if daily_plan and isinstance(daily_plan, dict) and "topic_example" in daily_plan and isinstance(daily_plan["topic_example"], dict):
        daily_plan["topic_example"]["visual_image_url"] = visual_url

    return {
        "exists": True,
        "id": mat.id,
        "course_id": mat.course_id,
        "week_number": mat.week_number,
        "topic": mat.topic,
        "subtopics": json.loads(mat.subtopics) if mat.subtopics else [],
        "learning_outcomes": json.loads(mat.learning_outcomes) if mat.learning_outcomes else [],
        "teaching_guide": guide,
        "daily_plan": daily_plan,
        "code_examples": json.loads(mat.code_examples) if mat.code_examples else [],
        "unit_questions": unit_questions,
        "lab_exercises": json.loads(mat.lab_exercises) if mat.lab_exercises else {},
        "quiz_questions": json.loads(mat.quiz_questions) if mat.quiz_questions else [],
        "slides": json.loads(mat.slides_json) if mat.slides_json else [],
        "pptx_file_path": mat.pptx_file_path,
        "visual_image_url": visual_url,
        "download_url": f"/api/bilisim/download-presentation/{mat.id}",
        "daily_plan_download_url": f"/api/bilisim/download-daily-plan/{mat.id}",
        "topic_download_url": f"/api/bilisim/download-topic-example/{mat.id}",
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
    3. Resmî MEB Günlük Ders Planı (.docx)
    4. Modül Ünite Sonu Değerlendirme Soruları ve Çözümleri
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

    # 6. Önceden DOCX Günlük Plan, Konu Örneği ve Canlı Görsel Simülasyonunu Oluştur
    visual_filename = f"visual_Hafta_{week_number}_{mat.id}.png"
    visual_path = os.path.join(UPLOADS_IMAGES_DIR, visual_filename)
    try:
        code_list = generated.get("code_examples", [])
        first_code = code_list[0].get("code", "") if code_list else ""
        generate_topic_visual_mockup(
            course_name=course.name,
            topic=mat.topic,
            code_snippet=first_code,
            output_path=visual_path
        )
    except Exception as err:
        print(f"[Bilisim AI] Görsel simülasyon uyarısı: {err}")

    try:
        docx_plan_filename = f"Gunluk_Plan_Hafta_{week_number}_{mat.id}.docx"
        docx_plan_path = os.path.join(UPLOADS_DOCX_DIR, docx_plan_filename)
        build_docx_daily_plan(
            material_data=generated,
            course_name=course.name,
            grade_level=course.grade_level,
            week_number=week_number,
            output_path=docx_plan_path
        )
    except Exception as err:
        print(f"[Bilisim AI] DOCX günlük plan uyarısı: {err}")

    try:
        docx_topic_filename = f"Konu_Ornegi_Hafta_{week_number}_{mat.id}.docx"
        docx_topic_path = os.path.join(UPLOADS_DOCX_DIR, docx_topic_filename)
        build_docx_topic_example(
            material_data=generated,
            course_name=course.name,
            grade_level=course.grade_level,
            week_number=week_number,
            output_path=docx_topic_path,
            visual_image_path=visual_path if os.path.exists(visual_path) else None
        )
    except Exception as err:
        print(f"[Bilisim AI] DOCX konu örneği uyarısı: {err}")

    visual_url = f"/uploads/images/{visual_filename}" if os.path.exists(visual_path) else None

    return {
        "message": f"{week_number}. Hafta materyalleri, MEB günlük planı, görsel çıktısı ve sunumu başarıyla oluşturuldu!",
        "material_id": mat.id,
        "week_number": week_number,
        "topic": mat.topic,
        "visual_image_url": visual_url,
        "download_url": f"/api/bilisim/download-presentation/{mat.id}",
        "daily_plan_download_url": f"/api/bilisim/download-daily-plan/{mat.id}",
        "topic_download_url": f"/api/bilisim/download-topic-example/{mat.id}"
    }

# ================= 6. PPTX VE DOCX MATERYAL İNDİRME =================

@router.get("/download-presentation/{material_id}")
def download_presentation(
    material_id: int,
    db: Session = Depends(get_db)
):
    """
    Oluşturulan PowerPoint (.pptx) sunum dosyasını indirir.
    Dosya diskte yoksa anında on-the-fly oluşturur ve teslim eder.
    """
    try:
        mat = db.query(BilisimWeeklyMaterial).filter(BilisimWeeklyMaterial.id == material_id).first()
        if not mat:
            raise HTTPException(status_code=404, detail="Ders materyali bulunamadı.")

        course = db.query(BilisimCourse).filter(BilisimCourse.id == mat.course_id).first()
        course_name = course.name if course else "Bilisim_Dersi"

        pptx_filename = f"Sunum_Hafta_{mat.week_number}_{mat.id}.pptx"
        full_path = os.path.join(UPLOADS_PPTX_DIR, pptx_filename)

        # Diskte yoksa anında oluştur
        if not os.path.exists(full_path):
            guide = json.loads(mat.teaching_guide) if mat.teaching_guide else {}
            slides_list = json.loads(mat.slides_json) if mat.slides_json else []
            if not slides_list:
                proc = generate_procedural_bilisim_material(
                    course_name=course_name,
                    grade_level=course.grade_level if course else "11. Sınıf",
                    week_number=mat.week_number,
                    topic=mat.topic,
                    outcomes=mat.learning_outcomes or ""
                )
                slides_list = proc.get("slides", [])
                mat.slides_json = json.dumps(slides_list, ensure_ascii=False)
                db.commit()

            mat_data = {
                "topic": mat.topic,
                "subtopics": json.loads(mat.subtopics) if mat.subtopics else [],
                "learning_outcomes": json.loads(mat.learning_outcomes) if mat.learning_outcomes else [],
                "teaching_guide": guide,
                "code_examples": json.loads(mat.code_examples) if mat.code_examples else [],
                "lab_exercises": json.loads(mat.lab_exercises) if mat.lab_exercises else {},
                "quiz_questions": json.loads(mat.quiz_questions) if mat.quiz_questions else [],
                "slides": slides_list
            }
            build_pptx_presentation(
                material_data=mat_data,
                course_name=course_name,
                week_number=mat.week_number,
                output_path=full_path
            )
            mat.pptx_file_path = f"/uploads/presentations/{pptx_filename}"
            db.commit()

        clean_title = to_safe_ascii_filename(course_name)
        download_name = f"PiriReis_{clean_title}_Hafta_{mat.week_number}_Sunusu.pptx"

        return FileResponse(
            path=full_path,
            filename=download_name,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation"
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"[Download Presentation Error] {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Sunum indirilirken hata oluştu: {str(e)}")

@router.get("/download-daily-plan/{material_id}")
def download_daily_plan(
    material_id: int,
    db: Session = Depends(get_db)
):
    """
    MEB formatında hazırlanmış Günlük Ders Planı (.docx) dosyasını indirir.
    Dosya diskte yoksa anında on-the-fly oluşturur ve teslim eder.
    """
    try:
        mat = db.query(BilisimWeeklyMaterial).filter(BilisimWeeklyMaterial.id == material_id).first()
        if not mat:
            raise HTTPException(status_code=404, detail="Ders materyali bulunamadı.")

        course = db.query(BilisimCourse).filter(BilisimCourse.id == mat.course_id).first()
        course_name = course.name if course else "Bilisim_Dersi"
        grade_level = course.grade_level if course else "11. Sınıf"

        docx_filename = f"Gunluk_Plan_Hafta_{mat.week_number}_{mat.id}.docx"
        full_path = os.path.join(UPLOADS_DOCX_DIR, docx_filename)

        if not os.path.exists(full_path):
            guide = json.loads(mat.teaching_guide) if mat.teaching_guide else {}
            daily_plan_data = guide.get("daily_plan")
            if not daily_plan_data:
                proc = generate_procedural_bilisim_material(
                    course_name=course_name,
                    grade_level=grade_level,
                    week_number=mat.week_number,
                    topic=mat.topic,
                    outcomes=mat.learning_outcomes or ""
                )
                daily_plan_data = proc.get("daily_plan", {})
                guide["daily_plan"] = daily_plan_data
                mat.teaching_guide = json.dumps(guide, ensure_ascii=False)
                db.commit()

            mat_data = {
                "topic": mat.topic,
                "learning_outcomes": json.loads(mat.learning_outcomes) if mat.learning_outcomes else [],
                "teaching_guide": guide,
                "code_examples": json.loads(mat.code_examples) if mat.code_examples else [],
                "unit_questions": guide.get("unit_questions", []),
                "daily_plan": daily_plan_data
            }
            build_docx_daily_plan(
                material_data=mat_data,
                course_name=course_name,
                grade_level=grade_level,
                week_number=mat.week_number,
                output_path=full_path
            )

        clean_title = to_safe_ascii_filename(course_name)
        download_name = f"PiriReis_{clean_title}_Hafta_{mat.week_number}_Gunluk_Plani.docx"

        return FileResponse(
            path=full_path,
            filename=download_name,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"[Download Daily Plan Error] {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Günlük plan indirilirken hata oluştu: {str(e)}")

@router.get("/download-topic-example/{material_id}")
def download_topic_example(
    material_id: int,
    db: Session = Depends(get_db)
):
    """
    Haftanın çalışan konu örneği, canlı görsel ekran simülasyonu ve modül soru çözümlerini (.docx) indirir.
    Dosya diskte yoksa anında on-the-fly oluşturur ve teslim eder.
    """
    try:
        mat = db.query(BilisimWeeklyMaterial).filter(BilisimWeeklyMaterial.id == material_id).first()
        if not mat:
            raise HTTPException(status_code=404, detail="Ders materyali bulunamadı.")

        course = db.query(BilisimCourse).filter(BilisimCourse.id == mat.course_id).first()
        course_name = course.name if course else "Bilisim_Dersi"
        grade_level = course.grade_level if course else "11. Sınıf"

        docx_filename = f"Konu_Ornegi_Hafta_{mat.week_number}_{mat.id}.docx"
        full_path = os.path.join(UPLOADS_DOCX_DIR, docx_filename)

        # Görsel dosyasını hazırla
        visual_filename = f"visual_Hafta_{mat.week_number}_{mat.id}.png"
        visual_path = os.path.join(UPLOADS_IMAGES_DIR, visual_filename)

        if not os.path.exists(full_path):
            guide = json.loads(mat.teaching_guide) if mat.teaching_guide else {}
            code_list = json.loads(mat.code_examples) if mat.code_examples else []
            unit_q = guide.get("unit_questions", [])
            daily_p = guide.get("daily_plan", {})
            
            if not unit_q or not daily_p or not code_list:
                proc = generate_procedural_bilisim_material(
                    course_name=course_name,
                    grade_level=grade_level,
                    week_number=mat.week_number,
                    topic=mat.topic,
                    outcomes=mat.learning_outcomes or ""
                )
                unit_q = proc.get("unit_questions", [])
                daily_p = proc.get("daily_plan", {})
                code_list = proc.get("code_examples", [])
                guide["unit_questions"] = unit_q
                guide["daily_plan"] = daily_p
                mat.teaching_guide = json.dumps(guide, ensure_ascii=False)
                mat.code_examples = json.dumps(code_list, ensure_ascii=False)
                db.commit()

        if not os.path.exists(visual_path):
            first_code = code_list[0].get("code", "") if code_list else ""
            try:
                generate_topic_visual_mockup(
                    course_name=course_name,
                    topic=mat.topic,
                    code_snippet=first_code,
                    output_path=visual_path
                )
            except Exception as v_err:
                print(f"[Visual Mockup Warning] {v_err}")

        mat_data = {
            "topic": mat.topic,
            "learning_outcomes": json.loads(mat.learning_outcomes) if mat.learning_outcomes else [],
            "teaching_guide": guide,
            "code_examples": code_list,
            "unit_questions": unit_q,
            "daily_plan": daily_p
        }
        build_docx_topic_example(
            material_data=mat_data,
            course_name=course_name,
            grade_level=grade_level,
            week_number=mat.week_number,
            output_path=full_path,
            visual_image_path=visual_path if os.path.exists(visual_path) else None
        )

        clean_title = to_safe_ascii_filename(course_name)
        download_name = f"PiriReis_{clean_title}_Hafta_{mat.week_number}_Konu_Ornegi.docx"

        return FileResponse(
            path=full_path,
            filename=download_name,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"[Download Topic Example Error] {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Konu örneği indirilirken hata oluştu: {str(e)}")

