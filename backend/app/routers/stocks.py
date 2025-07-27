from fastapi import APIRouter, HTTPException
from typing import List
from app.models import StockData, StockRequest, StockResponse

router = APIRouter(prefix="/api/stocks", tags=["stocks"])

# Mock stock data for demonstration
MOCK_STOCKS = {
    "AAPL": StockData(
        symbol="AAPL",
        price=150.25,
        change=2.15,
        change_percent=1.45,
        volume=50000000,
        market_cap=2500000000000,
        high=152.30,
        low=148.90,
        open=149.50,
        previous_close=148.10
    ),
    "GOOGL": StockData(
        symbol="GOOGL",
        price=2750.50,
        change=-15.25,
        change_percent=-0.55,
        volume=25000000,
        market_cap=1800000000000,
        high=2765.20,
        low=2740.10,
        open=2755.30,
        previous_close=2765.75
    ),
    "MSFT": StockData(
        symbol="MSFT",
        price=320.75,
        change=5.30,
        change_percent=1.68,
        volume=35000000,
        market_cap=2400000000000,
        high=322.40,
        low=318.20,
        open=319.80,
        previous_close=315.45
    ),
    "AMZN": StockData(
        symbol="AMZN",
        price=145.80,
        change=3.20,
        change_percent=2.24,
        volume=40000000,
        market_cap=1500000000000,
        high=146.50,
        low=143.90,
        open=144.20,
        previous_close=142.60
    ),
    "TSLA": StockData(
        symbol="TSLA",
        price=245.30,
        change=-8.70,
        change_percent=-3.42,
        volume=60000000,
        market_cap=780000000000,
        high=250.10,
        low=242.80,
        open=248.90,
        previous_close=254.00
    )
}

@router.get("/", response_model=List[StockData])
async def get_stocks():
    """
    Get list of all available stocks
    """
    return list(MOCK_STOCKS.values())

@router.get("/{symbol}", response_model=StockResponse)
async def get_stock(symbol: str):
    """
    Get specific stock data by symbol
    """
    symbol_upper = symbol.upper()
    if symbol_upper in MOCK_STOCKS:
        return StockResponse(success=True, data=MOCK_STOCKS[symbol_upper])
    else:
        raise HTTPException(status_code=404, detail=f"Stock {symbol} not found")

@router.post("/search", response_model=StockResponse)
async def search_stock(request: StockRequest):
    """
    Search for stock data
    """
    symbol_upper = request.symbol.upper()
    if symbol_upper in MOCK_STOCKS:
        return StockResponse(success=True, data=MOCK_STOCKS[symbol_upper])
    else:
        return StockResponse(
            success=False,
            message=f"Stock {request.symbol} not found"
        )

@router.get("/{symbol}/price")
async def get_stock_price(symbol: str):
    """
    Get only the price for a specific stock
    """
    symbol_upper = symbol.upper()
    if symbol_upper in MOCK_STOCKS:
        stock = MOCK_STOCKS[symbol_upper]
        return {
            "symbol": stock.symbol,
            "price": stock.price,
            "change": stock.change,
            "change_percent": stock.change_percent
        }
    else:
        raise HTTPException(status_code=404, detail=f"Stock {symbol} not found") 