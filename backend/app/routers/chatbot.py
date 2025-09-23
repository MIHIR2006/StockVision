from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
from datetime import datetime
from ..services.ai_services import AIStockAnalyzer, get_real_time_stock_data, get_stock_trends

router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])

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

# In-memory storage for demo (replace with database later)
chat_sessions = {}

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """Main chatbot endpoint"""
    try:
        # Initialize AI analyzer
        ai_analyzer = AIStockAnalyzer()
        
        # Analyze user query
        analysis = await ai_analyzer.analyze_stock_query(request.message)
        
        # Fetch required data based on analysis
        data = await fetch_stock_data(analysis)
        
        # Generate AI response
        response = await ai_analyzer.generate_response(request.message, data)
        
        # Store chat in memory (later: save to database)
        if request.session_id not in chat_sessions:
            chat_sessions[request.session_id] = []
        
        chat_sessions[request.session_id].extend([
            {
                "role": "user",
                "content": request.message,
                "timestamp": datetime.now()
            },
            {
                "role": "assistant", 
                "content": response,
                "timestamp": datetime.now(),
                "data": data
            }
        ])
        
        return ChatResponse(
            response=response,
            data=data,
            session_id=request.session_id,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

@router.get("/sessions/{session_id}")
async def get_chat_history(session_id: str):
    """Get chat history for a session"""
    if session_id in chat_sessions:
        return {"messages": chat_sessions[session_id]}
    return {"messages": []}

@router.delete("/sessions/{session_id}")
async def clear_chat_session(session_id: str):
    """Clear a chat session"""
    if session_id in chat_sessions:
        del chat_sessions[session_id]
    return {"message": "Session cleared"}

async def fetch_stock_data(analysis: Dict[str, Any]) -> Dict[str, Any]:
    """Fetch relevant stock data based on AI analysis"""
    data = {}
    
    try:
        if analysis["action"] == "get_price":
            for symbol in analysis.get("symbols", [])[:5]:  # Limit to 5 symbols
                stock_data = await get_real_time_stock_data(symbol)
                data[symbol] = stock_data
        
        elif analysis["action"] == "get_trends":
            for symbol in analysis.get("symbols", [])[:3]:  # Limit to 3 symbols for trends
                trends = await get_stock_trends(symbol, analysis.get("time_range", 30))
                data[f"{symbol}_trends"] = trends
        
        elif analysis["action"] == "market_summary":
            # Get summary of major indices
            major_stocks = ["AAPL", "GOOGL", "MSFT"]
            for symbol in major_stocks:
                stock_data = await get_real_time_stock_data(symbol)
                data[symbol] = stock_data
        
        # If no symbols found, provide general market info
        if not data and analysis["action"] in ["get_price", "get_trends"]:
            data["info"] = "No specific stocks mentioned. Try asking about stocks like AAPL, GOOGL, MSFT, or TSLA."
            
    except Exception as e:
        data["error"] = f"Error fetching stock data: {str(e)}"
    
    return data

@router.get("/health")
async def chatbot_health():
    """Health check endpoint"""
    return {"status": "healthy", "service": "AI Stock Chatbot"}