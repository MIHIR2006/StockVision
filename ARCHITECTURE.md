# StockVision Database Architecture

## Overview

StockVision uses a **dual-database architecture** to maintain clear separation of concerns between authentication and application functionality.

## Database Design

### 🔐 Frontend Authentication Database
- **Location**: `frontend/prisma/schema.prisma`
- **Technology**: Prisma ORM + PostgreSQL
- **Purpose**: User authentication and session management
- **Models**: 
  - `User` - User accounts for NextAuth.js

### 💬 Backend Application Database  
- **Location**: `backend/app/chat_models.py`
- **Technology**: SQLAlchemy ORM + SQLite (dev) / PostgreSQL (prod)
- **Purpose**: AI chatbot functionality and analytics
- **Models**:
  - `ChatSession` - Chat session metadata
  - `ChatMessage` - Individual chat messages with AI analysis

## Architectural Benefits

1. **Clear Separation**: Authentication logic is separate from business logic
2. **Technology Optimization**: Each service uses its preferred ORM/database
3. **Independent Scaling**: Auth and chat services can scale independently  
4. **No Schema Conflicts**: Each database owns its domain models
5. **Maintainability**: No dual-ORM conflicts or schema drift risks

## Migration History

**Previous Issue**: Originally had conflicting Prisma schema at root level that duplicated SQLAlchemy chat models, creating schema drift risk.

**Resolution**: Removed root `prisma/` directory and cleaned up duplicate dependencies. Now:
- Frontend: Uses Prisma for auth only
- Backend: Uses SQLAlchemy for chat/analytics only
- No conflicts or duplicate model definitions

## Development Notes

- Frontend Prisma client connects to PostgreSQL for user auth
- Backend SQLAlchemy connects to SQLite (dev) or PostgreSQL (prod) for chat data
- Both can use the same PostgreSQL instance with different table prefixes if needed
- Database migrations managed separately by each service