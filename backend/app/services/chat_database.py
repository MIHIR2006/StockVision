"""
Database service layer for AI Chatbot functionality

PERFORMANCE NOTE: All methods in this service are synchronous (def, not async def)
because they use synchronous SQLAlchemy operations. Using async def with sync DB
operations would block the FastAPI event loop and severely degrade performance.
"""
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import datetime
from ..chat_models import ChatSession, ChatMessage
from ..db import get_db

class ChatDatabaseService:
    """Service for managing chat sessions and messages in the database"""
    
    @staticmethod
    def get_or_create_session(db: Session, session_id: str, user_id: Optional[str] = None) -> ChatSession:
        """Get existing session or create a new one"""
        session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
        
        if not session:
            session = ChatSession(
                session_id=session_id,
                user_id=user_id,
                title=f"Chat Session {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}"
            )
            db.add(session)
            db.commit()
            db.refresh(session)
        return session
    
    @staticmethod
    def add_message(
        db: Session, 
        session_id: str, 
        role: str, 
        content: str, 
        metadata: Optional[Dict[str, Any]] = None
    ) -> ChatMessage:
        """Add a new message to a session"""
        session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
        if not session:
            # Auto-create session if somehow missing (defensive)
            session = ChatSession(
                session_id=session_id,
                title=f"Chat Session {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}"
            )
            db.add(session)
            db.flush()

        # Optionally embed natural session_id inside metadata for traceability
        enriched_meta = metadata.copy() if metadata else {}
        if "session_id" not in enriched_meta:
            enriched_meta["session_id"] = session.session_id
        message = ChatMessage(
            chat_session_fk=session.id,
            role=role,
            content=content,
            message_metadata=enriched_meta,
            timestamp=datetime.utcnow()
        )
        db.add(message)
        session.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(message)
        return message
    
    @staticmethod
    def get_session_messages(db: Session, session_id: str) -> List[Dict[str, Any]]:
        """Get all messages for a session"""
        # Join to filter by natural session id
        messages = (db.query(ChatMessage)
            .join(ChatSession, ChatMessage.chat_session_fk == ChatSession.id)
            .filter(ChatSession.session_id == session_id)
            .order_by(ChatMessage.timestamp.asc())
            .all())

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
    def get_user_sessions(db: Session, user_id: str) -> List[Dict[str, Any]]:
        """Get all sessions for a user with aggregated message counts (avoids N+1)."""
        from sqlalchemy import func
        rows = (
            db.query(
                ChatSession.session_id,
                ChatSession.created_at,
                ChatSession.updated_at,
                func.count(ChatMessage.id).label("message_count")
            )
            .outerjoin(ChatMessage, ChatMessage.chat_session_fk == ChatSession.id)
            .filter(ChatSession.user_id == user_id)
            .group_by(ChatSession.id)
            .order_by(ChatSession.updated_at.desc())
            .all()
        )
        return [
            {
                "session_id": r.session_id,
                "created_at": r.created_at.isoformat() if r.created_at else None,
                "updated_at": r.updated_at.isoformat() if r.updated_at else None,
                "message_count": int(r.message_count or 0)
            }
            for r in rows
        ]
    
    @staticmethod
    def delete_session(db: Session, session_id: str) -> bool:
        """Delete a session and all its messages"""
        session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
        
        if session:
            db.delete(session)  # This will cascade delete messages
            db.commit()
            return True
        
        return False
    
    @staticmethod
    def update_session_title(db: Session, session_id: str, title: str) -> bool:
        """Update session title"""
        session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
        
        if session:
            session.title = title
            session.updated_at = datetime.utcnow()
            db.commit()
            return True
        
        return False