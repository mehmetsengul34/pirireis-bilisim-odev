import sys, os, time
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(SCRIPT_DIR)
sys.path.insert(0, BACKEND_DIR)
from app.database import engine, SessionLocal
from app.models import User
from app.auth import verify_password
from sqlalchemy import text

print("Connecting to database:", engine.dialect.name, flush=True)
with engine.connect() as conn:
    if engine.dialect.name == "sqlite":
        cols = [r[1] for r in conn.execute(text("PRAGMA table_info(users)")).fetchall()]
    else:
        cols = [r[0] for r in conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'")).fetchall()]
    print("Users columns:", cols, flush=True)

    if "plain_password" not in cols:
        print("Adding plain_password column...", flush=True)
        if engine.dialect.name == "sqlite":
            conn.execute(text("ALTER TABLE users ADD COLUMN plain_password TEXT"))
        else:
            conn.execute(text("ALTER TABLE users ADD COLUMN plain_password VARCHAR(255)"))
        conn.commit()
        print("Column plain_password added successfully!", flush=True)

db = SessionLocal()
students = db.query(User).filter(User.role == "student").all()
print(f"Total students in DB: {len(students)}", flush=True)

updated_count = 0
for i, s in enumerate(students, 1):
    if not s.plain_password:
        if verify_password("1234", s.password_hash):
            s.plain_password = "1234"
            updated_count += 1
            print(f"[{i}/{len(students)}] {s.username}: 1234", flush=True)
        elif verify_password("123", s.password_hash):
            s.plain_password = "123"
            updated_count += 1
            print(f"[{i}/{len(students)}] {s.username}: 123", flush=True)
        else:
            print(f"[{i}/{len(students)}] {s.username}: Özel Şifre (Farklı)", flush=True)
    else:
        print(f"[{i}/{len(students)}] {s.username}: Zaten kayıtlı ({s.plain_password})", flush=True)

    if i % 10 == 0:
        db.commit()

db.commit()
print(f"\nTamamlandı! Toplam {updated_count} öğrencinin şifresi güncellendi.", flush=True)
db.close()
