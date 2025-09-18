from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Ensure .env is loaded if present
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

DATABASE_URL = os.getenv("DATABASE_URL")

# Provide a safe local fallback to allow dev server to boot
if not DATABASE_URL:
	# SQLite file inside backend directory to avoid permission issues
	DATABASE_URL = "sqlite:///./stockvision_dev.db"

# Create engine based on the scheme
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    # SQLite needs special connect args for check_same_thread in some contexts
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, pool_pre_ping=True, echo=False, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
