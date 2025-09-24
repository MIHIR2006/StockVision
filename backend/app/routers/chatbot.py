from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from functools import lru_cache
import json
from datetime import datetime
from sqlalchemy.orm import Session
from ..services.ai_services import AIStockAnalyzer, get_real_time_stock_data, get_stock_trends
from ..services.chat_database import ChatDatabaseService
from ..db import get_db

router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])

# Singleton AI Analyzer using dependency injection for performance
@lru_cache()
def get_ai_analyzer() -> AIStockAnalyzer:
    """Create a singleton AI analyzer instance to reuse across requests"""
    return AIStockAnalyzer()

# Configuration constants for stock data fetching
MAX_PRICE_SYMBOLS = 5  # Maximum number of symbols for price queries
MAX_TREND_SYMBOLS = 3  # Maximum number of symbols for trend analysis  
DEFAULT_TREND_DAYS = 30  # Default time range for trend analysis in days
MAJOR_MARKET_STOCKS = ["AAPL", "GOOGL", "MSFT"]  # Default stocks for market summary
EXAMPLE_STOCKS = ["AAPL", "GOOGL", "MSFT", "TSLA"]  # Example stocks for user guidance

# Pydantic models
class ChatRequest(BaseModel):
    message: str
    session_id: str
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    data: Optional[Dict[str, Any]] = None
    session_id: str
    timestamp: datetime

# Database-backed chat persistence (replacing in-memory storage)
chat_service = ChatDatabaseService()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest, 
    db: Session = Depends(get_db),
    ai_analyzer: AIStockAnalyzer = Depends(get_ai_analyzer)
):
    """Main chatbot endpoint with database persistence and singleton AI analyzer"""
    try:
        # Capture timestamp once for consistency across all operations
        request_timestamp = datetime.now()
        
        # Ensure session exists in database
        await chat_service.get_or_create_session(db, request.session_id, request.user_id)
        
        # Store user message in database
        await chat_service.add_message(
            db=db,
            session_id=request.session_id,
            role="user",
            content=request.message,
            metadata={"request_timestamp": request_timestamp.isoformat()}
        )
        
        # Use dependency-injected AI analyzer (singleton for performance)
        # No need to create new instance - analyzer is reused across requests
        
        # Analyze user query
        analysis = await ai_analyzer.analyze_stock_query(request.message)
        
        # Fetch required data based on analysis
        data = await fetch_stock_data(analysis)
        
        # Generate AI response
        response = await ai_analyzer.generate_response(request.message, data)
        
        # Store assistant response in database
        await chat_service.add_message(
            db=db,
            session_id=request.session_id,
            role="assistant",
            content=response,
            metadata={
                "analysis": analysis,
                "stock_data": data,
                "response_timestamp": request_timestamp.isoformat()
            }
        )
        
        return ChatResponse(
            response=response,
            data=data,
            session_id=request.session_id,
            timestamp=request_timestamp
        )
        
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

@router.get("/sessions/{session_id}")
async def get_chat_history(session_id: str, db: Session = Depends(get_db)):
    """Get chat history for a session from database"""
    try:
        messages = await chat_service.get_session_messages(db, session_id)
        return {"messages": messages}
    except Exception as e:
        print(f"Get history error: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving chat history: {str(e)}")

@router.delete("/sessions/{session_id}")
async def clear_chat_session(session_id: str, db: Session = Depends(get_db)):
    """Delete a chat session from database"""
    try:
        success = await chat_service.delete_session(db, session_id)
        if success:
            return {"message": "Session deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Session not found")
    except Exception as e:
        print(f"Delete session error: {e}")
        raise HTTPException(status_code=500, detail=f"Error deleting session: {str(e)}")

@router.get("/sessions")
async def get_user_sessions(user_id: str, db: Session = Depends(get_db)):
    """Get all sessions for a user"""
    try:
        sessions = await chat_service.get_user_sessions(db, user_id)
        return {"sessions": sessions}
    except Exception as e:
        print(f"Get sessions error: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving sessions: {str(e)}")

async def fetch_stock_data(analysis: Dict[str, Any]) -> Dict[str, Any]:
    """Fetch relevant stock data based on AI analysis"""
    data = {}
    
    try:
        if analysis["action"] == "get_price":
            # Limit symbols using configurable constant
            for symbol in analysis.get("symbols", [])[:MAX_PRICE_SYMBOLS]:
                stock_data = await get_real_time_stock_data(symbol)
                data[symbol] = stock_data
        
        elif analysis["action"] == "get_trends":
            # Limit symbols and use configurable time range
            for symbol in analysis.get("symbols", [])[:MAX_TREND_SYMBOLS]:
                trends = await get_stock_trends(
                    symbol, 
                    analysis.get("time_range", DEFAULT_TREND_DAYS)
                )
                data[f"{symbol}_trends"] = trends
        
        elif analysis["action"] == "market_summary":
            # Use configurable list of major market stocks
            for symbol in MAJOR_MARKET_STOCKS:
                stock_data = await get_real_time_stock_data(symbol)
                data[symbol] = stock_data
        
        # If no symbols found, provide general market info with configurable examples
        if not data and analysis["action"] in ["get_price", "get_trends"]:
            example_stocks_str = ", ".join(EXAMPLE_STOCKS)
            data["info"] = f"No specific stocks mentioned. Try asking about stocks like {example_stocks_str}."
            
    except Exception as e:
        data["error"] = f"Error fetching stock data: {str(e)}"
    
    return data

@router.get("/health")
async def chatbot_health():
    """Health check endpoint"""
    return {"status": "healthy", "service": "AI Stock Chatbot"}