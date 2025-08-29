# Backend Structure & Frontend Integration Guide

##  Backend Architecture

### **File Structure:**
```
backend/
├── main.py                    # FastAPI app entry point
├── requirements.txt           # Python dependencies
├── pyproject.toml            # Project configuration
├── env.example               # Environment variables template
├── package.json              # NPM scripts (monorepo integration)
├── README.md                 # Backend documentation
└── app/                      # Application package
    ├── __init__.py           # Package initialization
    ├── models.py             # Pydantic data models
    └── routers/              # API route handlers
        ├── __init__.py       # Router package init
        ├── stocks.py         # Stock data endpoints
        └── market.py         # Market data endpoints
```

##  **Core Files Explanation**

### 1. **`main.py`** - Application Entry Point
```python
# Key Features:
- FastAPI app initialization
- CORS middleware configuration
- Router inclusion (stocks & market)
- Health check endpoints
- Error handlers
```

**CORS Configuration:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://localhost:3001",
        "https://stockvision.vercel.app",  # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. **`app/models.py`** - Data Models
```python
# Pydantic Models:
- StockData: Complete stock information
- StockRequest: API request structure
- StockResponse: API response wrapper
- MarketSummary: Market overview data
- MarketTrends: Market trends and indicators
```

### 3. **`app/routers/stocks.py`** - Stock API Endpoints
```python
# Available Endpoints:
GET /api/stocks              # Get all available stocks
GET /api/stocks/{symbol}     # Get specific stock data
POST /api/stocks/search      # Search for stock data
GET /api/stocks/{symbol}/price  # Get stock price only
```

### 4. **`app/routers/market.py`** - Market API Endpoints
```python
# Available Endpoints:
GET /api/market/summary      # Market summary data
GET /api/market/trends       # Market trends
GET /api/market/sectors      # Sector performance
GET /api/market/indicators   # Market indicators
GET /api/market/volume       # Volume data
```

##  **Frontend-Backend Integration**

### **Connection Flow:**
```
Frontend (Next.js) ←→ Backend (FastAPI)
     Port 3000           Port 8000
```

### **CORS Setup:**
- Backend allows requests from frontend origins
- Frontend can make API calls to backend endpoints
- Credentials and headers are properly configured

### **API Communication Example:**
```javascript
// Frontend API call example
const fetchStockData = async (symbol) => {
  try {
    const response = await fetch(`http://localhost:8000/api/stocks/${symbol}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
  }
};

// Usage in React component
const [stockData, setStockData] = useState(null);

useEffect(() => {
  fetchStockData('AAPL').then(setStockData);
}, []);
```

##  **Available API Endpoints**

### **Health & Status:**
- `GET /` - Root endpoint
- `GET /health` - Health check

### **Stock Data:**
- `GET /api/stocks` - List all stocks
- `GET /api/stocks/AAPL` - Get Apple stock data
- `POST /api/stocks/search` - Search stocks
- `GET /api/stocks/AAPL/price` - Get Apple price only

### **Market Data:**
- `GET /api/market/summary` - Market overview
- `GET /api/market/trends` - Market trends
- `GET /api/market/sectors` - Sector performance
- `GET /api/market/indicators` - Market indicators
- `GET /api/market/volume` - Volume data

### **Documentation:**
- `GET /docs` - Swagger UI documentation
- `GET /redoc` - ReDoc documentation

##  **Data Models**

### **StockData Model:**
```python
{
  "symbol": "AAPL",
  "price": 150.25,
  "change": 2.15,
  "change_percent": 1.45,
  "volume": 50000000,
  "market_cap": 2500000000000,
  "high": 152.30,
  "low": 148.90,
  "open": 149.50,
  "previous_close": 148.10
}
```

### **MarketSummary Model:**
```python
{
  "total_market_cap": 6700000000000,
  "active_stocks": 5000,
  "market_sentiment": "bullish",
  "top_gainers": ["AAPL", "MSFT", "NVDA"],
  "top_losers": ["GOOGL", "TSLA", "NFLX"]
}
```

##  **Development Workflow**

### **Starting the Backend:**
```bash
# From root directory
npm run dev:backend

# Or directly
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### **Testing API Endpoints:**
1. Start backend server
2. Visit http://localhost:8000/docs
3. Use Swagger UI to test endpoints
4. Or use curl/Postman for direct testing

### **Frontend Integration Steps:**
1. Replace mock data in frontend with API calls
2. Update fetch URLs to point to backend
3. Handle loading states and errors
4. Test integration thoroughly

##  **Next Steps for Integration**

1. **Update Frontend API Calls:**
   - Replace hardcoded data with backend API calls
   - Add error handling and loading states
   - Implement real-time data updates

2. **Add Real Stock Data:**
   - Integrate with Alpha Vantage or Yahoo Finance APIs
   - Implement caching and rate limiting
   - Add real-time data streaming

3. **Enhance Features:**
   - User authentication and portfolios
   - Advanced charting and analytics
   - Real-time notifications

##  **Current Status**

- [x] Backend API fully functional  
- [x] CORS properly configured  
- [x] All endpoints documented  
- [x] Ready for frontend integration  
- [x] Mock data available for testing  

