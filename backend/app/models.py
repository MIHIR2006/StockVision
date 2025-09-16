from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
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
    sector_performance: Dict = Field(..., description="Sector performance data")
    market_indicators: Dict = Field(..., description="Market indicators")

class ErrorResponse(BaseModel):
    success: bool = Field(False, description="Request success status")
    message: str = Field(..., description="Error message")
    error_code: Optional[str] = Field(None, description="Error code")

class PortfolioStock(BaseModel):
    symbol: str = Field(..., description="Stock symbol")
    name: str = Field(..., description="Stock name")
    shares: int = Field(..., description="Number of shares")
    avg_cost: float = Field(..., description="Average cost per share")
    current_price: float = Field(..., description="Current stock price")
    value: float = Field(..., description="Current value of holdings")
    allocation: float = Field(..., description="Portfolio allocation percentage")

class Portfolio(BaseModel):
    id: str = Field(..., description="Portfolio ID")
    name: str = Field(..., description="Portfolio name")
    description: Optional[str] = Field(None, description="Portfolio description")
    total_value: float = Field(..., description="Total portfolio value")
    total_cost: float = Field(..., description="Total cost basis")
    day_change: float = Field(..., description="Daily change in value")
    day_change_percent: float = Field(..., description="Daily change percentage")
    total_gain_loss: float = Field(..., description="Total gain/loss")
    total_gain_loss_percent: float = Field(..., description="Total gain/loss percentage")
    stocks: List[PortfolioStock] = Field(..., description="Portfolio stocks")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")

class PortfolioHistory(BaseModel):
    portfolio_id: str = Field(..., description="Portfolio ID")
    date: str = Field(..., description="Date")
    value: float = Field(..., description="Portfolio value on date")
    change: float = Field(..., description="Daily change")
    change_percent: float = Field(..., description="Daily change percentage")

class PortfolioComparison(BaseModel):
    portfolios: List[str] = Field(..., description="Portfolio IDs to compare")
    time_range: str = Field("1y", description="Time range for comparison")
    metrics: List[str] = Field(["value", "returns"], description="Metrics to compare")

class CreatePortfolioRequest(BaseModel):
    name: str = Field(..., description="Portfolio name")
    description: Optional[str] = Field(None, description="Portfolio description")

class UpdatePortfolioRequest(BaseModel):
    name: Optional[str] = Field(None, description="Portfolio name")
    description: Optional[str] = Field(None, description="Portfolio description") 

class User(BaseModel):
    email: EmailStr
    password: str

class UserInDB(User):
    reset_token: Optional[str] = None
    reset_token_expiry: Optional[datetime] = None

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str