# StockVision Backend

FastAPI backend for the StockVision application providing stock market data and analytics.

## Features

- **Stock Data API**: Real-time and historical stock data
- **Market Analytics**: Market trends, sector performance, and indicators
- **RESTful API**: Clean, documented API endpoints
- **CORS Support**: Configured for frontend integration
- **Type Safety**: Full Pydantic model validation
- **Documentation**: Auto-generated API docs with Swagger/ReDoc

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **Pydantic**: Data validation using Python type annotations
- **Uvicorn**: ASGI server for running FastAPI
- **Python 3.8+**: Modern Python features and type hints

## Quick Start

### Prerequisites

- Python 3.8 or higher
- pip or poetry for package management

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Run the development server**:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Using npm scripts (from monorepo root)

```bash
# Install all dependencies
npm run install:all

# Run backend only
npm run dev:backend

# Run both frontend and backend
npm run dev
```

## API Documentation

Once the server is running, you can access:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## API Endpoints

### Stock Data

- `GET /api/stocks` - Get all available stocks
- `GET /api/stocks/{symbol}` - Get specific stock data
- `POST /api/stocks/search` - Search for stock data
- `GET /api/stocks/{symbol}/price` - Get stock price only

### Market Data

- `GET /api/market/summary` - Get market summary
- `GET /api/market/trends` - Get market trends
- `GET /api/market/sectors` - Get sector performance
- `GET /api/market/indicators` - Get market indicators
- `GET /api/market/volume` - Get volume data

### Health & Status

- `GET /` - Root endpoint
- `GET /health` - Health check

## Development

### Code Quality

```bash
# Format code
black .
isort .

# Lint code
flake8 .

# Type checking
mypy .

# Run tests
pytest
```

### Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── models.py          # Pydantic models
│   └── routers/           # API route handlers
│       ├── __init__.py
│       ├── stocks.py      # Stock-related endpoints
│       └── market.py      # Market-related endpoints
├── main.py               # FastAPI application entry point
├── requirements.txt      # Python dependencies
├── pyproject.toml       # Project configuration
├── env.example          # Environment variables template
└── README.md           # This file
```

## Environment Variables

Copy `env.example` to `.env` and configure:

- `API_HOST`: Server host (default: 0.0.0.0)
- `API_PORT`: Server port (default: 8000)
- `DEBUG`: Debug mode (default: True)
- `ALLOWED_ORIGINS`: CORS allowed origins

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_stocks.py
```

## Deployment

### Production

```bash
# Install production dependencies
pip install -r requirements.txt

# Run production server
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Docker (Future)

```bash
# Build image
docker build -t stockvision-backend .

# Run container
docker run -p 8000:8000 stockvision-backend
```

## Contributing

1. Follow the existing code style (Black + isort)
2. Add tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting

## License

MIT License - see LICENSE file for details. 