from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv

# Import routers
from app.routers import stocks, market, portfolios, auth, chatbot

# Import database
from app.db import engine, Base
from app.user_models import UserDB

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="StockVision API",
    description="FastAPI backend for StockVision application",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://localhost:3001",
        "https://stockvision.vercel.app",  # Production frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(stocks.router)
app.include_router(market.router)
app.include_router(portfolios.router)
app.include_router(auth.router)  # Auth routes added

# Include routers
app.include_router(auth.router, prefix="/api", tags=["Authentication"])
app.include_router(stocks.router, prefix="/api", tags=["Stocks"])
app.include_router(market.router, prefix="/api", tags=["Market"])
app.include_router(portfolios.router, prefix="/api", tags=["Portfolios"])
app.include_router(chatbot.router, prefix="/api", tags=["Chatbot"])

# Create all DB tables
Base.metadata.create_all(bind=engine)

# Health check endpoints
@app.get("/")
async def root():
    return {"message": "StockVision API is running!", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "stockvision-api"}

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"success": False, "message": "Resource not found"}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "Internal server error"}
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
