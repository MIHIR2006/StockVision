# StockVision

## 1️⃣ Visualize Your Portfolio Performance 

Track your investments, analyze performance, and make data-driven decisions with our powerful financial dashboard.

![Stockvision](StockVison.png)

---

## 2️⃣ Project Overview

StockVision is a modern, interactive dashboard for investors and traders. It provides a comprehensive view of your portfolio, real-time market data, and insightful analytics to help you make smarter financial decisions.

---

## 3️⃣ Features

- **Portfolio Overview:** Visualize your holdings and performance at a glance.
- **Multi-Portfolio Management:** Create, manage, and compare multiple portfolios.
- **Portfolio Comparison:** Interactive charts to compare performance across portfolios.
- **Historical Analysis:** Track portfolio performance over different time periods.
- **Market Data Center:** Access up-to-date market data and trends.
- **Performance Analytics:** Analyze your portfolio's growth and risk.
- **Recent Activity:** Track your latest transactions and changes.
- **Customizable Dashboard:** Modular components for a personalized experience.

---

![Stockvision](Dashboard.png)

---

## 4️⃣ Tech Stack

[![Tech Stack](https://skillicons.dev/icons?i=nextjs,fastapi,vercel,ts,python,postgres,prisma&theme=dark)](https://skillicons.dev)

### Frontend
- **Framework:** Next.js 15 (Monorepo)
- **Language:** TypeScript
- **Authentication:** NextAuth.js + Prisma
- **State Management:** React Context API
- **UI:** Radix UI, Shadcn UI
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

### Backend
- **Framework:** [FastAPI (Python)](./Backend.md)
- **Database:** SQLAlchemy + SQLite/PostgreSQL  
- **Features:** AI Chatbot, REST API, CORS, Pydantic validation, auto docs
- **Dev Tools:** Uvicorn, Black, isort, flake8, pytest

### Database Architecture
- **Authentication:** Prisma + PostgreSQL (Frontend)
- **Chat & Analytics:** SQLAlchemy + SQLite/PostgreSQL (Backend)

### For a detailed explanation of the backend structure, API endpoints, and integration, see [Backend.md](./Backend.md).
---

## 5️⃣ Folder Structure

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

## 6️⃣ Quick Start

### Prerequisites
- **Node.js 18+** and **npm 9+**
- **Python 3.8+** and **pip**
- **PostgreSQL 14+** (running locally with a database created, e.g. `stockvision`)
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
3. **Set up backend environment variables (PostgreSQL required)**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env and set DATABASE_URL, for example:
   # DATABASE_URL=postgresql://user:password@localhost:5432/stockvision
   cd ..
   ```
4. **Start PostgreSQL locally (recommended: Docker)**
   ```bash
   # Start a local PostgreSQL 16 container on port 5432
   docker run --name stockvision-postgres \
     -e POSTGRES_USER=svuser -e POSTGRES_PASSWORD=svpass -e POSTGRES_DB=stockvision \
     -p 5432:5432 -d postgres:16

   # Set the same DATABASE_URL in your shell (PowerShell example)
   # $env:DATABASE_URL="postgresql://svuser:svpass@localhost:5432/stockvision"
   ```

   Useful Docker commands:
   - Start: `docker start stockvision-postgres`
   - Stop: `docker stop stockvision-postgres`
   - Logs: `docker logs -f stockvision-postgres`

5. **Setup database client (Prisma) for frontend**
   ```bash
   cd frontend
   npm install
   # Ensure DATABASE_URL is available in environment (same as backend)
   # On Windows PowerShell:
   #   $env:DATABASE_URL="postgresql://user:password@localhost:5432/stockvision"
   # On Unix shells:
   #   export DATABASE_URL="postgresql://user:password@localhost:5432/stockvision"
   npm run db:generate
   npm run db:dev
   cd ..
   ```
6. **Run the development servers**
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

## 7️⃣ Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **API ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

---

## 8️⃣ Development & Scripts

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

## 9️⃣ API Endpoints (Backend)

See [Backend.md](./Backend.md) for full details, but here are the essentials:

### Stock Data
- `GET /api/stocks` - All stocks
- `GET /api/stocks/{symbol}` - Specific stock
- `POST /api/stocks/search` - Search stocks
- `GET /api/stocks/{symbol}/price` - Stock price only

### Portfolio Management
- `GET /api/portfolios` - Get all portfolios
- `GET /api/portfolios/{id}` - Get specific portfolio
- `POST /api/portfolios` - Create new portfolio
- `PUT /api/portfolios/{id}` - Update portfolio
- `DELETE /api/portfolios/{id}` - Delete portfolio
- `GET /api/portfolios/{id}/history` - Portfolio historical data
- `POST /api/portfolios/compare` - Compare multiple portfolios
- `GET /api/portfolios/analytics/summary` - Combined portfolio analytics

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

## 1️⃣0️⃣ Database Architecture

StockVision uses a **dual-database approach** for optimal separation of concerns:

### 🔐 **Authentication Database (Frontend)**
- **Technology**: Prisma + PostgreSQL
- **Purpose**: User authentication and session management
- **Models**: `User` only
- **Location**: `frontend/prisma/schema.prisma`
- **Used by**: NextAuth.js authentication system

### 💬 **Chat & Analytics Database (Backend)**  
- **Technology**: SQLAlchemy + SQLite (dev) / PostgreSQL (prod)
- **Purpose**: AI chatbot sessions, messages, and analytics
- **Models**: `ChatSession`, `ChatMessage`
- **Location**: `backend/app/chat_models.py`
- **Used by**: FastAPI chatbot service

This architecture ensures:
- **Clear separation**: Auth vs application data
- **Technology optimization**: Each service uses its preferred ORM
- **Independent scaling**: Auth and chat services can scale separately
- **No schema conflicts**: Each database has its own models

---

## 1️⃣1️⃣ Configuration

### Backend (.env)
```bash
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
# Required PostgreSQL connection string
# Example: postgresql://user:password@localhost:5432/stockvision
DATABASE_URL=postgresql://user:password@localhost:5432/stockvision
```

### Frontend
The frontend uses Prisma + PostgreSQL **only for authentication**. Ensure `DATABASE_URL` is set in your shell (or create `frontend/.env.local`) before running:
```bash
cd frontend
npm run db:generate
npm run db:dev
```

#### View the Database (Prisma Studio)
Use Prisma Studio to inspect tables and data in your PostgreSQL database.

PowerShell (Windows):
```powershell
cd frontend
$env:DATABASE_URL="postgresql://svuser:svpass@localhost:5432/stockvision"
npm run db:studio
```

Unix shells (macOS/Linux/WSL):
```bash
cd frontend
export DATABASE_URL="postgresql://svuser:svpass@localhost:5432/stockvision"
npm run db:studio
```

This opens a local UI at http://localhost:5555 showing your Prisma models and rows.

Optional: connect with psql (Docker example):
```bash
docker exec -it stockvision-postgres psql -U svuser -d stockvision
```

#### Example `frontend/.env.local`
```bash
# PostgreSQL database URL used by Prisma
DATABASE_URL="postgresql://user:password@localhost:5432/stockvision?schema=public"

# Optional: Backend API URL if the frontend calls the backend
# NEXT_PUBLIC_API_URL="http://localhost:8000"
```

---

## 1️⃣2️⃣ Roadmap

- [x] Multi-portfolio management and comparison
- [ ] Real-time stock data integration
- [ ] User authentication and portfolio persistence
- [ ] Advanced charting features
- [ ] Portfolio optimization suggestions
- [ ] Risk analysis and alerts
- [ ] Mobile app development
- [ ] Machine learning predictions
- [ ] Social trading features


---

## 1️⃣3️⃣ Production Deployment

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

### NextAuth on Vercel (production)

Set these environment variables in the Vercel project (Frontend):

- `NEXTAUTH_URL` = your production URL (e.g. `https://your-app.vercel.app`)
- `NEXTAUTH_SECRET` = a strong random string (e.g. output of `openssl rand -base64 32`)
- `DATABASE_URL` = your production PostgreSQL connection string
- Optional OAuth providers:
  - `GITHUB_ID`, `GITHUB_SECRET`
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

Provider callback URLs to configure in the provider dashboards:
- GitHub: `https://your-app.vercel.app/api/auth/callback/github`
- Google: `https://your-app.vercel.app/api/auth/callback/google`

Notes:
- App Router auth endpoint is at `app/api/auth/[...nextauth]/route.ts` and is production-safe.
- Keep `debug` off in production (it's automatically off when `NODE_ENV=production`).

---

## 1️⃣4️⃣ TurboRepo

This monorepo uses [Turborepo](https://turbo.build/) for fast, cacheable builds and development.

## 1️⃣5️⃣ Contributing

We love our contributors! Here's how you can contribute:

- [Open an issue](https://github.com/MIHIR2006/StockVision/issues) if you believe you've encountered a bug.
- Follow the local development guide to get your local dev environment set up.
- Make a [pull request](https://github.com/MIHIR2006/StockVision/pulls) to add new features/make quality-of-life improvements/fix bugs.

<a href="https://github.com/MIHIR2006/StockVision/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=MIHIR2006/StockVision" />
</a>


---

## 1️⃣6️⃣ Repo Activity

![Alt](https://repobeats.axiom.co/api/embed/ec1c47a5d3bcf938b5065f7f0efb5cd9effbb94f.svg "Repobeats analytics image")


