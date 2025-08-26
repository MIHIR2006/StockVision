from fastapi import APIRouter, Depends
from typing import Optional
from app.services.stock_service import get_stock_screener, get_historical_price

router = APIRouter()

@router.get("/list")
def list_stocks(
    marketCapMoreThan: Optional[float] = None,
    marketCapLowerThan: Optional[float] = None,
    priceMoreThan: Optional[float] = None,
    priceLowerThan: Optional[float] = None,
    betaMoreThan: Optional[float] = None,
    betaLowerThan: Optional[float] = None,
    volumeMoreThan: Optional[float] = None,
    volumeLowerThan: Optional[float] = None,
    dividendMoreThan: Optional[float] = None,
    dividendLowerThan: Optional[float] = None,
    isEtf: Optional[bool] = None,
    isActivelyTrading: Optional[bool] = None,
    sector: Optional[str] = None,
    industry: Optional[str] = None,
    country: Optional[str] = None,
    exchange: Optional[str] = None,
    limit: Optional[int] = 100,
):
    params = {
        "marketCapMoreThan": marketCapMoreThan,
        "marketCapLowerThan": marketCapLowerThan,
        "priceMoreThan": priceMoreThan,
        "priceLowerThan": priceLowerThan,
        "betaMoreThan": betaMoreThan,
        "betaLowerThan": betaLowerThan,
        "volumeMoreThan": volumeMoreThan,
        "volumeLowerThan": volumeLowerThan,
        "dividendMoreThan": dividendMoreThan,
        "dividendLowerThan": dividendLowerThan,
        "isEtf": isEtf,
        "isActivelyTrading": isActivelyTrading,
        "sector": sector,
        "industry": industry,
        "country": country,
        "exchange": exchange,
        "limit": limit,
    }
    return get_stock_screener(params)

@router.get("/history/{ticker}")
def history(ticker: str):
    return get_historical_price(ticker)
