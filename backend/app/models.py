from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class StockData(BaseModel):
    symbol: str = Field(..., description="Stock symbol")
    price: float = Field(..., description="Current stock price")
    change: float = Field(..., description="Price change from previous close")
    change_percent: float = Field(..., description="Percentage change")
    volume: int = Field(..., description="Trading volume")
    market_cap: Optional[float] = Field(None, description="Market capitalization")
    high: Optional[float] = Field(None, description="Day's high")
    low: Optional[float] = Field(None, description="Day's low")
    open: Optional[float] = Field(None, description="Opening price")
    previous_close: Optional[float] = Field(None, description="Previous closing price")
    timestamp: Optional[datetime] = Field(None, description="Data timestamp")

class StockRequest(BaseModel):
    symbol: str = Field(..., description="Stock symbol to search for")

class StockResponse(BaseModel):
    success: bool = Field(..., description="Request success status")
    data: Optional[StockData] = Field(None, description="Stock data")
    message: Optional[str] = Field(None, description="Response message")

class MarketSummary(BaseModel):
    total_market_cap: float = Field(..., description="Total market capitalization")
    active_stocks: int = Field(..., description="Number of active stocks")
    market_sentiment: str = Field(..., description="Market sentiment indicator")
    top_gainers: List[str] = Field(..., description="Top gaining stocks")
    top_losers: List[str] = Field(..., description="Top losing stocks")

class MarketTrends(BaseModel):
    sector_performance: dict = Field(..., description="Sector performance data")
    market_indicators: dict = Field(..., description="Market indicators")

class ErrorResponse(BaseModel):
    success: bool = Field(False, description="Request success status")
    message: str = Field(..., description="Error message")
    error_code: Optional[str] = Field(None, description="Error code") 