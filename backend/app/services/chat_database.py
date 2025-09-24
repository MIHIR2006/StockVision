"""
Database service layer for AI Chatbot functionality
"""
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import datetime
from ..chat_models import ChatSession, ChatMessage
from ..db import get_db

class ChatDatabaseService:
    """Service for managing chat sessions and messages in the database"""
    
    @staticmethod
    async def get_or_create_session(db: Session, session_id: str, user_id: Optional[str] = None) -> ChatSession:
        """Get existing session or create a new one"""
        session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
        
        if not session:
            session = ChatSession(
                session_id=session_id,
                user_id=user_id,
                title=f"Chat Session {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            )
            db.add(session)
            db.commit()
            db.refresh(session)
        
        return session
    
    @staticmethod
    async def add_message(
        db: Session, 
        session_id: str, 
        role: str, 
        content: str, 
        metadata: Optional[Dict[str, Any]] = None
    ) -> ChatMessage:
        """Add a new message to a session"""
        message = ChatMessage(
            session_id=session_id,
            role=role,
            content=content,
            message_metadata=metadata,
            timestamp=datetime.utcnow()
        )
        
        db.add(message)
        db.commit()
        db.refresh(message)
        
        # Update session's updated_at timestamp
        session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
        if session:
            session.updated_at = datetime.utcnow()
            db.commit()
        
        return message
    
    @staticmethod
    async def get_session_messages(db: Session, session_id: str) -> List[Dict[str, Any]]:
        """Get all messages for a session"""
        messages = db.query(ChatMessage).filter(
            ChatMessage.session_id == session_id
        ).order_by(ChatMessage.timestamp.asc()).all()
        
        return [
            {
                "role": msg.role,
                "content": msg.content,
                "metadata": msg.message_metadata,
                "timestamp": msg.timestamp.isoformat()
            }
            for msg in messages
        ]
    
    @staticmethod
    async def get_user_sessions(db: Session, user_id: str) -> List[Dict[str, Any]]:
        """Get all sessions for a user"""
        sessions = db.query(ChatSession).filter(
            ChatSession.user_id == user_id
        ).order_by(ChatSession.updated_at.desc()).all()
        
        return [
            {
                "session_id": session.session_id,
                "title": session.title,
                "created_at": session.created_at.isoformat(),
                "updated_at": session.updated_at.isoformat(),
                "message_count": len(session.messages)
            }
            for session in sessions
        ]
    
    @staticmethod
    async def delete_session(db: Session, session_id: str) -> bool:
        """Delete a session and all its messages"""
        session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
        
        if session:
            db.delete(session)  # This will cascade delete messages
            db.commit()
            return True
        
        return False
    
    @staticmethod
    async def update_session_title(db: Session, session_id: str, title: str) -> bool:
        """Update session title"""
        session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
        
        if session:
            session.title = title
            session.updated_at = datetime.utcnow()
            db.commit()
            return True
        
        return False