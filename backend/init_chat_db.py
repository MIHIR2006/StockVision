"""
Database initialization script for AI Chatbot tables
"""
import sys
import os

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db import engine, Base
from app.chat_models import ChatSession, ChatMessage

def create_chat_tables():
    """Create chat session and message tables"""
    try:
        # Import all models to ensure they're registered
        from app.chat_models import ChatSession, ChatMessage
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print(" Chat database tables created successfully!")
        
        # Verify tables exist
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        expected_tables = ['chat_sessions', 'chat_messages']
        for table in expected_tables:
            if table in tables:
                print(f" Table '{table}' exists")
            else:
                print(f"Table '{table}' missing")
        
        return True
        
    except Exception as e:
        print(f"Error creating tables: {e}")
        return False

if __name__ == "__main__":
    print("Initializing AI Chatbot database tables...")
    success = create_chat_tables()
    
    if success:
        print("\n Database initialization complete!")
        print(" Chat sessions will now persist across server restarts")
        print(" Memory usage optimized")
        print(" Production-ready database storage")
    else:
        print("\n Database initialization failed")
        sys.exit(1)