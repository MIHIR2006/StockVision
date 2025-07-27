# StockVision

## Visualize Your Portfolio Performance 

Track your investments, analyze performance, and make data-driven decisions with our powerful financial dashboard.

![Stockvision](StockVison.png)

---

## 📊 Project Overview

StockVision is a modern, interactive dashboard for investors and traders. It provides a comprehensive view of your portfolio, real-time market data, and insightful analytics to help you make smarter financial decisions.

---

## ✨ Features

- **Portfolio Overview:** Visualize your holdings and performance at a glance.
- **Market Data Center:** Access up-to-date market data and trends.
- **Performance Analytics:** Analyze your portfolio's growth and risk.
- **Recent Activity:** Track your latest transactions and changes.
- **Customizable Dashboard:** Modular components for a personalized experience.

---

![Stockvision](Dashboard.png)

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (Monorepo)
- **Language:** TypeScript
- **State Management:** React Context API
- **UI:** Radix UI, Shadcn UI
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

### Backend
- **Framework:** [FastAPI (Python)](./Backend.md)
- **Features:** REST API, CORS, Pydantic validation, auto docs, market/stock endpoints
- **Dev Tools:** Uvicorn, Black, isort, flake8, pytest

### For a detailed explanation of the backend structure, API endpoints, and integration, see [Backend.md](./Backend.md).
---

## 📁 Folder Structure

```
StockVision/
├── frontend/                 # Next.js Frontend Application
│   ├── app/                 # Next.js App Router
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   └── ...                 # Frontend config files
├── backend/                 # FastAPI Backend Application
│   ├── app/                # FastAPI application code
│   │   ├── models.py       # Pydantic models
│   │   └── routers/        # API route handlers
│   ├── main.py            # FastAPI entry point
│   ├── requirements.txt    # Python dependencies
│   └── ...                # Backend config files
├── package.json            # Root monorepo configuration
├── Backend.md              # **Backend details and API documentation**
└── README.md              # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and **npm 9+**
- **Python 3.8+** and **pip**
- **Git**

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/MIHIR2006/StockVision.git
   cd StockVision
   ```
2. **Install all dependencies**
   ```bash
   npm install
   # (installs both frontend and backend dependencies)
   ```
3. **Set up backend environment variables**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env with your configuration
   cd ..
   ```
4. **Run the development servers**
   ```bash
   # Start both frontend and backend together
   npm run dev
   # Or run individually:
   npm run dev:frontend  # Frontend only (http://localhost:3000)
   npm run dev:backend   # Backend only (http://127.0.0.1:8000)
   ```
   - Frontend: Open [http://localhost:3000](http://localhost:3000)
   - Backend: Open [http://localhost:8000/docs](http://localhost:8000/docs) for API docs

---

## 🔐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **API ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

---

## 🔧 Development & Scripts

### Monorepo Scripts
```bash
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
npm run build            # Build both applications
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only
npm run start            # Start both in production mode
npm run lint             # Lint all workspaces
npm run install:all      # Install all dependencies
```

### Frontend Scripts
```bash
cd frontend
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Lint TypeScript/ESLint
```

### Backend Scripts
```bash
cd backend
npm run dev              # Start FastAPI dev server
npm run start            # Start production server
npm run test             # Run tests
npm run lint             # Format and lint code
```

---

## 📚 API Endpoints (Backend)

See [Backend.md](./Backend.md) for full details, but here are the essentials:

### Stock Data
- `GET /api/stocks` - All stocks
- `GET /api/stocks/{symbol}` - Specific stock
- `POST /api/stocks/search` - Search stocks
- `GET /api/stocks/{symbol}/price` - Stock price only

### Market Data
- `GET /api/market/summary` - Market summary
- `GET /api/market/trends` - Market trends
- `GET /api/market/sectors` - Sector performance
- `GET /api/market/indicators` - Market indicators
- `GET /api/market/volume` - Volume data

### Health & Docs
- `GET /` - Root
- `GET /health` - Health check
- `GET /docs` - Swagger UI
- `GET /redoc` - ReDoc

---

## 🔧 Configuration

### Backend (.env)
```bash
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Frontend
The frontend uses Next.js environment variables. Create `.env.local` in the frontend directory if needed.

---

## 🗺️ Roadmap

- [ ] Real-time stock data integration
- [ ] User authentication and portfolios
- [ ] Advanced charting features
- [ ] Mobile app development
- [ ] Machine learning predictions
- [ ] Social trading features


---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🚀 Production Deployment

### Monorepo Management

This project uses [Turborepo](https://turbo.build/) for monorepo management and build optimization.

- **Dev:** `npm run dev` (runs both frontend and backend)
- **Build:** `npm run build`
- **Start:** `npm run start`

### Deployment

- **Frontend:** Deploy the `frontend` directory to Vercel (set root to `frontend` in Vercel dashboard).
- **Backend:** Deploy the `backend` directory to a Python-friendly host (Render, Railway, Fly.io, etc).
- **API URL:** Set `NEXT_PUBLIC_API_URL` in Vercel to your backend’s public URL.

See [Backend.md](./Backend.md) for backend deployment and API details.

---

## 🏁 TurboRepo

This monorepo uses [Turborepo](https://turbo.build/) for fast, cacheable builds and development.