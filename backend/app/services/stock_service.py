import os
import requests

FMP_API_KEY = os.getenv("FMP_API_KEY")
BASE_URL = "https://financialmodelingprep.com/api/v3"

def get_stock_screener(params):
    url = f"{BASE_URL}/stock-screener?apikey={FMP_API_KEY}"
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

def get_historical_price(ticker):
    url = f"{BASE_URL}/historical-price-full/{ticker}?apikey={FMP_API_KEY}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()
