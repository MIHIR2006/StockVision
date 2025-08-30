from fastapi import APIRouter, HTTPException
from typing import List, Dict
from datetime import datetime, timedelta
import uuid
import random

from ..models import (
    Portfolio, PortfolioStock, PortfolioHistory, PortfolioComparison,
    CreatePortfolioRequest, UpdatePortfolioRequest
)

router = APIRouter(prefix="/api/portfolios", tags=["portfolios"])

# Mock data storage (in production, use a database)
mock_portfolios: Dict[str, Portfolio] = {}
mock_portfolio_history: Dict[str, List[PortfolioHistory]] = {}

# Initialize with sample portfolios
def init_sample_portfolios():
    if not mock_portfolios:
        # Sample Portfolio 1: Long-Term
        portfolio1_id = str(uuid.uuid4())
        portfolio1 = Portfolio(
            id=portfolio1_id,
            name="Long-Term Growth",
            description="Conservative long-term investment strategy",
            total_value=45000.0,
            total_cost=38000.0,
            day_change=234.50,
            day_change_percent=0.52,
            total_gain_loss=7000.0,
            total_gain_loss_percent=18.42,
            stocks=[
                PortfolioStock(
                    symbol="AAPL", name="Apple Inc.", shares=50, avg_cost=150.0,
                    current_price=174.79, value=8739.5, allocation=19.4
                ),
                PortfolioStock(
                    symbol="MSFT", name="Microsoft", shares=40, avg_cost=280.0,
                    current_price=338.47, value=13538.8, allocation=30.1
                ),
                PortfolioStock(
                    symbol="GOOG", name="Alphabet", shares=60, avg_cost=120.0,
                    current_price=138.96, value=8337.6, allocation=18.5
                ),
                PortfolioStock(
                    symbol="VTI", name="Vanguard Total Stock", shares=100, avg_cost=140.0,
                    current_price=143.84, value=14384.0, allocation=32.0
                )
            ],
            created_at=datetime.now() - timedelta(days=365),
            updated_at=datetime.now()
        )
        
        # Sample Portfolio 2: Trading Account
        portfolio2_id = str(uuid.uuid4())
        portfolio2 = Portfolio(
            id=portfolio2_id,
            name="Trading Account",
            description="Active trading portfolio for short-term gains",
            total_value=25000.0,
            total_cost=23000.0,
            day_change=-156.75,
            day_change_percent=-0.62,
            total_gain_loss=2000.0,
            total_gain_loss_percent=8.70,
            stocks=[
                PortfolioStock(
                    symbol="TSLA", name="Tesla", shares=30, avg_cost=180.0,
                    current_price=163.57, value=4907.1, allocation=19.6
                ),
                PortfolioStock(
                    symbol="NVDA", name="NVIDIA", shares=25, avg_cost=400.0,
                    current_price=445.67, value=11141.75, allocation=44.6
                ),
                PortfolioStock(
                    symbol="AMD", name="Advanced Micro Devices", shares=50, avg_cost=90.0,
                    current_price=95.23, value=4761.5, allocation=19.0
                ),
                PortfolioStock(
                    symbol="AMZN", name="Amazon", shares=15, avg_cost=140.0,
                    current_price=147.03, value=2205.45, allocation=8.8
                ),
                PortfolioStock(
                    symbol="META", name="Meta Platforms", shares=10, avg_cost=180.0,
                    current_price=198.45, value=1984.5, allocation=7.9
                )
            ],
            created_at=datetime.now() - timedelta(days=180),
            updated_at=datetime.now()
        )
        
        mock_portfolios[portfolio1_id] = portfolio1
        mock_portfolios[portfolio2_id] = portfolio2
        
        # Generate mock history for both portfolios
        for portfolio_id in [portfolio1_id, portfolio2_id]:
            history = []
            base_value = mock_portfolios[portfolio_id].total_value
            for i in range(90, 0, -1):
                date = datetime.now() - timedelta(days=i)
                # Simulate value fluctuation
                variation = random.uniform(-0.03, 0.03)
                value = base_value * (1 + variation * (90 - i) / 90)
                change = random.uniform(-500, 500)
                change_percent = (change / value) * 100 if value > 0 else 0
                
                history.append(PortfolioHistory(
                    portfolio_id=portfolio_id,
                    date=date.strftime("%Y-%m-%d"),
                    value=round(value, 2),
                    change=round(change, 2),
                    change_percent=round(change_percent, 2)
                ))
            mock_portfolio_history[portfolio_id] = history

init_sample_portfolios()

@router.get("/", response_model=List[Portfolio])
async def get_portfolios():
    """Get all portfolios"""
    return list(mock_portfolios.values())

@router.get("/{portfolio_id}", response_model=Portfolio)
async def get_portfolio(portfolio_id: str):
    """Get a specific portfolio by ID"""
    if portfolio_id not in mock_portfolios:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return mock_portfolios[portfolio_id]

@router.post("/", response_model=Portfolio)
async def create_portfolio(request: CreatePortfolioRequest):
    """Create a new portfolio"""
    portfolio_id = str(uuid.uuid4())
    portfolio = Portfolio(
        id=portfolio_id,
        name=request.name,
        description=request.description,
        total_value=0.0,
        total_cost=0.0,
        day_change=0.0,
        day_change_percent=0.0,
        total_gain_loss=0.0,
        total_gain_loss_percent=0.0,
        stocks=[],
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    mock_portfolios[portfolio_id] = portfolio
    mock_portfolio_history[portfolio_id] = []
    return portfolio

@router.put("/{portfolio_id}", response_model=Portfolio)
async def update_portfolio(portfolio_id: str, request: UpdatePortfolioRequest):
    """Update a portfolio"""
    if portfolio_id not in mock_portfolios:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    portfolio = mock_portfolios[portfolio_id]
    if request.name:
        portfolio.name = request.name
    if request.description:
        portfolio.description = request.description
    portfolio.updated_at = datetime.now()
    
    return portfolio

@router.delete("/{portfolio_id}")
async def delete_portfolio(portfolio_id: str):
    """Delete a portfolio"""
    if portfolio_id not in mock_portfolios:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    del mock_portfolios[portfolio_id]
    if portfolio_id in mock_portfolio_history:
        del mock_portfolio_history[portfolio_id]
    
    return {"success": True, "message": "Portfolio deleted successfully"}

@router.get("/{portfolio_id}/history", response_model=List[PortfolioHistory])
async def get_portfolio_history(portfolio_id: str, days: int = 90):
    """Get portfolio historical data"""
    if portfolio_id not in mock_portfolios:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    history = mock_portfolio_history.get(portfolio_id, [])
    return history[-days:] if days > 0 else history

@router.post("/compare")
async def compare_portfolios(comparison: PortfolioComparison):
    """Compare multiple portfolios"""
    result = {"portfolios": [], "comparison_data": []}
    
    # Validate portfolio IDs
    for portfolio_id in comparison.portfolios:
        if portfolio_id not in mock_portfolios:
            raise HTTPException(status_code=404, detail=f"Portfolio {portfolio_id} not found")
    
    # Get portfolio data
    for portfolio_id in comparison.portfolios:
        portfolio = mock_portfolios[portfolio_id]
        history = mock_portfolio_history.get(portfolio_id, [])
        
        result["portfolios"].append({
            "id": portfolio.id,
            "name": portfolio.name,
            "total_value": portfolio.total_value,
            "total_gain_loss_percent": portfolio.total_gain_loss_percent,
            "day_change_percent": portfolio.day_change_percent
        })
    
    # Generate comparison chart data
    if len(comparison.portfolios) > 0:
        # Get the longest history to align dates
        all_histories = [mock_portfolio_history.get(pid, []) for pid in comparison.portfolios]
        if all_histories and any(all_histories):
            max_length = max(len(h) for h in all_histories if h)
            
            for i in range(max_length):
                data_point = {}
                for j, portfolio_id in enumerate(comparison.portfolios):
                    history = all_histories[j]
                    if i < len(history):
                        if not data_point.get("date"):
                            data_point["date"] = history[i].date
                        portfolio_name = mock_portfolios[portfolio_id].name
                        data_point[portfolio_name] = history[i].value
                
                if data_point:
                    result["comparison_data"].append(data_point)
    
    return result

@router.get("/analytics/summary")
async def get_portfolio_analytics():
    """Get combined analytics across all portfolios"""
    if not mock_portfolios:
        return {
            "total_portfolios": 0,
            "combined_value": 0.0,
            "combined_gain_loss": 0.0,
            "combined_gain_loss_percent": 0.0,
            "best_performer": None,
            "worst_performer": None
        }
    
    portfolios = list(mock_portfolios.values())
    total_value = sum(p.total_value for p in portfolios)
    total_cost = sum(p.total_cost for p in portfolios)
    combined_gain_loss = total_value - total_cost
    combined_gain_loss_percent = (combined_gain_loss / total_cost * 100) if total_cost > 0 else 0
    
    best_performer = max(portfolios, key=lambda p: p.total_gain_loss_percent)
    worst_performer = min(portfolios, key=lambda p: p.total_gain_loss_percent)
    
    return {
        "total_portfolios": len(portfolios),
        "combined_value": round(total_value, 2),
        "combined_gain_loss": round(combined_gain_loss, 2),
        "combined_gain_loss_percent": round(combined_gain_loss_percent, 2),
        "best_performer": {
            "name": best_performer.name,
            "gain_loss_percent": best_performer.total_gain_loss_percent
        },
        "worst_performer": {
            "name": worst_performer.name,
            "gain_loss_percent": worst_performer.total_gain_loss_percent
        }
    }