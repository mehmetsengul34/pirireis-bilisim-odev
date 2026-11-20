from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Classroom, ClassroomStudent, Notification
from app.schemas import NotificationOut, NotificationCreate
from app.auth import get_current_user, require_teacher

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

@router.get("", response_model=List[NotificationOut])
def list_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Kullanıcıya gelen veya gönderilen bildirimleri listeler."""
    if current_user.role == "teacher":
        # Öğretmen: Kendisine gelen veya kendisinin gönderdiği son bildirimler
        notifications = db.query(Notification).filter(
            (Notification.receiver_id == current_user.id) | (Notification.sender_id == current_user.id)
        ).order_by(Notification.created_at.desc()).limit(50).all()
    else:
        # Öğrenci: Kendi sınıflarına veya şahsına gelen bildirimler
        student_class_ids = [
            row[0] for row in db.query(ClassroomStudent.classroom_id).filter(
                ClassroomStudent.student_id == current_user.id
            ).all()
        ]
        notifications = db.query(Notification).filter(
            (Notification.receiver_id == current_user.id) | 
            (Notification.classroom_id.in_(student_class_ids)) |
            (Notification.classroom_id.is_(None) & Notification.receiver_id.is_(None))
        ).order_by(Notification.created_at.desc()).limit(50).all()

    results = []
    for n in notifications:
        sender_name = n.sender.full_name if n.sender else "Sistem"
        classroom_name = n.classroom.name if n.classroom else None
        results.append(NotificationOut(
            id=n.id,
            sender_id=n.sender_id,
            sender_name=sender_name,
            receiver_id=n.receiver_id,
            classroom_id=n.classroom_id,
            classroom_name=classroom_name,
            title=n.title,
            message=n.message,
            notification_type=n.notification_type,
            link_path=n.link_path,
            is_read=n.is_read,
            created_at=n.created_at
        ))

    return results

@router.post("", response_model=NotificationOut)
def send_notification(
    req: NotificationCreate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Öğretmenin bir sınıfa veya belirli bir öğrenciye bildirim göndermesini sağlar."""
    classroom_name = None
    if req.classroom_id:
        classroom = db.query(Classroom).filter(Classroom.id == req.classroom_id).first()
        if classroom:
            classroom_name = classroom.name

    notification = Notification(
        sender_id=current_user.id,
        receiver_id=req.receiver_id,
        classroom_id=req.classroom_id,
        title=req.title,
        message=req.message,
        notification_type=req.notification_type or "general",
        link_path=req.link_path,
        is_read=False
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)

    return NotificationOut(
        id=notification.id,
        sender_id=notification.sender_id,
        sender_name=current_user.full_name,
        receiver_id=notification.receiver_id,
        classroom_id=notification.classroom_id,
        classroom_name=classroom_name,
        title=notification.title,
        message=notification.message,
        notification_type=notification.notification_type,
        link_path=notification.link_path,
        is_read=notification.is_read,
        created_at=notification.created_at
    )

@router.put("/{notification_id}/read")
def mark_as_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Bildirimi okundu olarak işaretler."""
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    # GÜVENLİK: Başka bir kullanıcıya özel gönderilmiş bildirim değiştirilemez.
    if not notification or (
        notification.receiver_id is not None and notification.receiver_id != current_user.id
    ):
        raise HTTPException(status_code=404, detail="Bildirim bulunamadı.")

    notification.is_read = True
    db.commit()
    return {"message": "Bildirim okundu olarak işaretlendi."}

@router.put("/read-all")
def mark_all_as_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Tüm bildirimleri okundu olarak işaretler."""
    if current_user.role == "teacher":
        db.query(Notification).filter(Notification.receiver_id == current_user.id).update({"is_read": True})
    else:
        student_class_ids = [
            row[0] for row in db.query(ClassroomStudent.classroom_id).filter(
                ClassroomStudent.student_id == current_user.id
            ).all()
        ]
        db.query(Notification).filter(
            (Notification.receiver_id == current_user.id) | (Notification.classroom_id.in_(student_class_ids))
        ).update({"is_read": True})
    db.commit()
    return {"message": "Tüm bildirimler okundu olarak işaretlendi."}
