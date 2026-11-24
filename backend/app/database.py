import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")

def get_engine():
    global DATABASE_URL
    if DATABASE_URL:
        # Standardize PostgreSQL URLs for SQLAlchemy with psycopg2
        target_url = DATABASE_URL
        if target_url.startswith("postgres://"):
            target_url = target_url.replace("postgres://", "postgresql+psycopg2://", 1)
        elif target_url.startswith("postgresql://") and not target_url.startswith("postgresql+"):
            target_url = target_url.replace("postgresql://", "postgresql+psycopg2://", 1)

        try:
            pg_engine = create_engine(
                target_url,
                pool_pre_ping=True,
                pool_recycle=300,
                connect_args={"connect_timeout": 10}
            )
            # Verify connection
            with pg_engine.connect() as conn:
                pass
            return pg_engine
        except Exception as err:
            print(f"[UYARI] PostgreSQL baglantisi saglanamadi: {err}")
            print("[BILGI] Yerel SQLite (lms.db) veritabanina otomatik gecis yapiliyor.")

    # SQLite Fallback / Local Default
    db_path = os.path.join(BASE_DIR, "lms.db")
    sqlite_url = f"sqlite:///{db_path}"
    return create_engine(
        sqlite_url,
        connect_args={"check_same_thread": False}
    )

engine = get_engine()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db_info():
    is_postgres = engine.dialect.name == "postgresql"
    return {
        "dialect": engine.dialect.name,
        "is_persistent": is_postgres,
        "status_text": "Kalıcı PostgreSQL Bulut Veritabanı" if is_postgres else "Geçici / Yerel SQLite Veritabanı"
    }

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

