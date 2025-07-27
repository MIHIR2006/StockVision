from fastapi import APIRouter
from app.models import MarketSummary, MarketTrends

router = APIRouter(prefix="/api/market", tags=["market"])

@router.get("/summary", response_model=MarketSummary)
async def get_market_summary():
    """
    Get market summary data
    """
    return MarketSummary(
        total_market_cap=6700000000000,
        active_stocks=5000,
        market_sentiment="bullish",
        top_gainers=["AAPL", "MSFT", "NVDA", "AMZN", "META"],
        top_losers=["GOOGL", "TSLA", "NFLX", "UBER", "LYFT"]
    )

@router.get("/trends", response_model=MarketTrends)
async def get_market_trends():
    """
    Get market trends data
    """
    return MarketTrends(
        sector_performance={
            "technology": 2.5,
            "healthcare": 1.8,
            "finance": -0.5,
            "energy": 3.2,
            "consumer_discretionary": 1.2,
            "consumer_staples": 0.8,
            "industrials": 1.5,
            "materials": 2.1,
            "real_estate": -1.2,
            "utilities": 0.5,
            "communication_services": 0.9
        },
        market_indicators={
            "vix": 18.5,
            "fear_greed_index": 65,
            "s&p_500": 4200.50,
            "nasdaq": 13500.25,
            "dow_jones": 34500.75
        }
    )

@router.get("/sectors")
async def get_sector_performance():
    """
    Get detailed sector performance data
    """
    return {
        "sectors": [
            {
                "name": "Technology",
                "performance": 2.5,
                "top_stocks": ["AAPL", "MSFT", "NVDA", "GOOGL", "META"]
            },
            {
                "name": "Healthcare",
                "performance": 1.8,
                "top_stocks": ["JNJ", "PFE", "UNH", "ABBV", "TMO"]
            },
            {
                "name": "Finance",
                "performance": -0.5,
                "top_stocks": ["JPM", "BAC", "WFC", "GS", "MS"]
            },
            {
                "name": "Energy",
                "performance": 3.2,
                "top_stocks": ["XOM", "CVX", "COP", "EOG", "SLB"]
            }
        ]
    }

@router.get("/indicators")
async def get_market_indicators():
    """
    Get market indicators and metrics
    """
    return {
        "volatility": {
            "vix": 18.5,
            "vix_change": -0.8,
            "vix_percent": -4.15
        },
        "sentiment": {
            "fear_greed_index": 65,
            "sentiment_label": "Greed",
            "previous_value": 62
        },
        "major_indices": {
            "s&p_500": {
                "value": 4200.50,
                "change": 15.25,
                "change_percent": 0.36
            },
            "nasdaq": {
                "value": 13500.25,
                "change": 45.80,
                "change_percent": 0.34
            },
            "dow_jones": {
                "value": 34500.75,
                "change": 125.50,
                "change_percent": 0.36
            }
        }
    }

@router.get("/volume")
async def get_market_volume():
    """
    Get market volume data
    """
    return {
        "total_volume": 8500000000,
        "average_volume": 4200000000,
        "volume_change": 0.12,
        "most_active": [
            {"symbol": "TSLA", "volume": 60000000},
            {"symbol": "AAPL", "volume": 50000000},
            {"symbol": "AMZN", "volume": 40000000},
            {"symbol": "MSFT", "volume": 35000000},
            {"symbol": "GOOGL", "volume": 25000000}
        ]
    } 