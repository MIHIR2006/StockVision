from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

# If no DATABASE_URL is provided, use SQLite for development
# This allows the chatbot feature to work without requiring PostgreSQL setup
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./stockvision.db"

# Create engine with appropriate settings
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
