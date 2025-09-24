#!/usr/bin/env python3
"""
Simple server starter for testing without reload issues
"""
import sys
import os


sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import required modules
from main import app
import uvicorn

if __name__ == "__main__":
    print(" Starting StockVision Backend Server...")
    print(" Server URL: http://127.0.0.1:8000")
    print(" API Docs: http://127.0.0.1:8000/docs")
    
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        reload=False,
        log_level="info"
    )