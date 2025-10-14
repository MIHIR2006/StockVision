# Contributing to StockVision 🚀

<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="Line">
</div>

<p align="center">
  <strong>First off, thank you for considering contributing to StockVision!</strong><br>
  It's people like you that make StockVision such a great tool for investors and traders worldwide.
</p>

<div align="center">
  <img src="https://media.giphy.com/media/f3iwJFOVOwuy7K6FFw/giphy.gif" width="400" alt="Coding">
</div>

<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="Line">
</div>

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png" alt="Line">
</div>

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/solar.png" alt="Line">
</div>

## 🤝 How Can I Contribute?

<p align="center">
  <img src="https://media.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif" width="300" alt="Contributing">
</p>

### Reporting Bugs 🐛

Before creating bug reports, please check the [issue tracker](https://github.com/MIHIR2006/StockVision/issues) as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what behavior you expected**
- **Include screenshots or animated GIFs if possible**
- **Include your environment details** (OS, Node version, Python version, Browser)

### Suggesting Enhancements 💡

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other applications**
- **Include mockups or examples if applicable**

### Your First Code Contribution 🎯

Unsure where to begin? You can start by looking through these issues:

- **`good first issue`** - Issues that should only require a few lines of code
- **`help wanted`** - Issues that may be more involved but are great for new contributors
- **`hacktoberfest`** - Issues specifically tagged for Hacktoberfest

### Pull Requests 🔀

- Fill in the required template
- Follow the coding standards
- Include tests when adding new features
- Update documentation as needed
- End all files with a newline

<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/grass.png" alt="Line">
</div>

## 🚀 Getting Started

<p align="center">
  <img src="https://media.giphy.com/media/ZVik7pBtu9dNS/giphy.gif" width="400" alt="Getting Started">
</p>

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** and **npm 9+**
- **Python 3.8+** and **pip**
- **PostgreSQL 14+**
- **Git**
- **Docker** (optional, for running PostgreSQL locally)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork locally:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/StockVision.git
   cd StockVision
   ```

3. **Add the upstream repository:**
   ```bash
   git remote add upstream https://github.com/MIHIR2006/StockVision.git
   ```

### Initial Setup

1. **Install all dependencies:**
   ```bash
   npm install
   ```

2. **Set up PostgreSQL database:**
   
   Using Docker (recommended):
   ```bash
   docker run --name stockvision-postgres \
     -e POSTGRES_USER=svuser \
     -e POSTGRES_PASSWORD=svpass \
     -e POSTGRES_DB=stockvision \
     -p 5432:5432 -d postgres:16
   ```

3. **Configure environment variables:**
   
   Backend (`backend/.env`):
   ```bash
   cd backend
   cp env.example .env
   # Edit .env and set:
   # DATABASE_URL=postgresql://svuser:svpass@localhost:5432/stockvision
   cd ..
   ```

   Frontend (set in shell or create `frontend/.env.local`):
   ```bash
   DATABASE_URL=postgresql://svuser:svpass@localhost:5432/stockvision
   ```

4. **Set up Prisma (Frontend database client):**
   ```bash
   cd frontend
   
   # Windows PowerShell:
   $env:DATABASE_URL="postgresql://svuser:svpass@localhost:5432/stockvision"
   
   # Unix shells (macOS/Linux/WSL):
   export DATABASE_URL="postgresql://svuser:svpass@localhost:5432/stockvision"
   
   npm run db:generate
   npm run db:dev
   cd ..
   ```

5. **Start development servers:**
   ```bash
   npm run dev
   ```
   
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" alt="Line">
</div>

## 🔄 Development Workflow

<p align="center">
  <img src="https://media.giphy.com/media/coxQHKASG60HrHtvkt/giphy.gif" width="350" alt="Workflow">
</p>

### Creating a New Branch

Always create a new branch for your work:

```bash
# Update your fork
git fetch upstream
git checkout main
git merge upstream/main

# Create a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### Branch Naming Conventions

- **Features:** `feature/feature-name` (e.g., `feature/add-portfolio-analytics`)
- **Bug Fixes:** `fix/bug-description` (e.g., `fix/login-redirect-issue`)
- **Documentation:** `docs/description` (e.g., `docs/update-api-guide`)
- **Refactoring:** `refactor/description` (e.g., `refactor/simplify-auth-flow`)
- **Tests:** `test/description` (e.g., `test/add-portfolio-tests`)

### Making Changes

1. **Make your changes** in your feature branch
2. **Test your changes thoroughly**
3. **Follow the coding standards** (see below)
4. **Commit your changes** with clear commit messages
5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Keeping Your Branch Updated

Regularly sync your branch with upstream:

```bash
git fetch upstream
git rebase upstream/main
```

<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" alt="Line">
</div>

## 📁 Project Structure

<p align="center">
  <img src="https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif" width="300" alt="Project Structure">
</p>

```
StockVision/
├── frontend/                 # Next.js Frontend Application
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes (NextAuth, etc.)
│   │   ├── components/     # React components
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── login/          # Login page
│   │   ├── signup/         # Signup page
│   │   └── styles/         # Global styles
│   ├── components/         # Shared UI components
│   ├── prisma/            # Prisma schema and migrations
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
│
├── backend/                # FastAPI Backend Application
│   ├── app/               # FastAPI application code
│   │   ├── routers/       # API route handlers
│   │   │   ├── auth.py
│   │   │   ├── chatbot.py
│   │   │   ├── market.py
│   │   │   ├── portfolios.py
│   │   │   └── stocks.py
│   │   ├── services/      # Business logic services
│   │   ├── chat_models.py # Chat database models
│   │   ├── db.py          # Database configuration
│   │   ├── models.py      # Pydantic models
│   │   └── user_models.py # User models
│   ├── main.py            # FastAPI entry point
│   ├── requirements.txt   # Python dependencies
│   └── package.json       # Backend npm scripts
│
├── package.json           # Root monorepo configuration
├── turbo.json            # Turborepo configuration
├── README.md             # Project documentation
├── Backend.md            # Backend API documentation
└── CONTRIBUTING.md       # This file
```

### Key Areas to Contribute

- **Frontend (`frontend/`)**: Next.js, React, TypeScript, Tailwind CSS
- **Backend (`backend/`)**: FastAPI, Python, SQLAlchemy
- **Authentication**: NextAuth.js integration
- **UI Components**: Radix UI, Shadcn UI components
- **Database**: Prisma (Frontend auth), SQLAlchemy (Backend)
- **API**: RESTful endpoints, FastAPI routers

<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/vintage.png" alt="Line">
</div>

## 💻 Coding Standards

<p align="center">
  <img src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif" width="350" alt="Coding Standards">
</p>

> **Note:** Following our coding standards ensures consistency across the codebase and makes collaboration easier for everyone!

### Frontend (TypeScript/React)

#### Style Guide

- Use **TypeScript** for all new files
- Use **functional components** with hooks
- Follow **React best practices**
- Use **Tailwind CSS** for styling (no inline styles except for dynamic values)
- Use **async/await** instead of promises when possible
- Keep components **small and focused** (single responsibility)

#### Naming Conventions

- **Components:** PascalCase (e.g., `DashboardPage.tsx`)
- **Files:** camelCase or kebab-case (e.g., `userService.ts`, `api-config.ts`)
- **Functions:** camelCase (e.g., `getUserProfile()`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Interfaces/Types:** PascalCase with 'I' prefix or descriptive name (e.g., `User`, `PortfolioData`)

#### Code Example

```typescript
// ✅ Good
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface PortfolioProps {
  userId: string;
  portfolioId: string;
}

export default function Portfolio({ userId, portfolioId }: PortfolioProps) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/portfolios/${portfolioId}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [portfolioId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{data?.name}</h2>
      <Button onClick={() => console.log("Refresh")}>Refresh</Button>
    </div>
  );
}
```

### Backend (Python/FastAPI)

#### Style Guide

- Follow **PEP 8** style guide
- Use **type hints** for all function parameters and return values
- Use **Pydantic models** for request/response validation
- Keep functions **small and focused**
- Use **async/await** for I/O operations
- Document all API endpoints with docstrings

#### Naming Conventions

- **Functions/Methods:** snake_case (e.g., `get_portfolio_by_id()`)
- **Classes:** PascalCase (e.g., `PortfolioService`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `DEFAULT_PAGE_SIZE`)
- **Private methods:** _leading_underscore (e.g., `_validate_data()`)

#### Code Example

```python
# ✅ Good
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter(prefix="/api/portfolios", tags=["portfolios"])

class Portfolio(BaseModel):
    id: str
    name: str
    user_id: str
    value: float

@router.get("/{portfolio_id}", response_model=Portfolio)
async def get_portfolio(
    portfolio_id: str,
    user_id: Optional[str] = None
) -> Portfolio:
    """
    Get portfolio by ID.
    
    Args:
        portfolio_id: The unique identifier of the portfolio
        user_id: Optional user ID for authorization
        
    Returns:
        Portfolio object with details
        
    Raises:
        HTTPException: If portfolio not found
    """
    portfolio = await _fetch_portfolio_from_db(portfolio_id)
    
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    return portfolio
```

### General Guidelines

- **Write self-documenting code** with clear variable and function names
- **Add comments** for complex logic, but avoid obvious comments
- **Keep functions small** (ideally under 50 lines)
- **DRY principle** - Don't Repeat Yourself
- **KISS principle** - Keep It Simple, Stupid
- **Test your changes** before submitting

<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/water.png" alt="Line">
</div>

## 📝 Commit Guidelines

<p align="center">
  <img src="https://media.giphy.com/media/du3J3cXyzhj75IOgvA/giphy.gif" width="350" alt="Git Commits">
</p>

> **Remember:** A well-written commit message can save hours of confusion later!

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat:** A new feature
- **fix:** A bug fix
- **docs:** Documentation only changes
- **style:** Changes that don't affect code meaning (formatting, etc.)
- **refactor:** Code change that neither fixes a bug nor adds a feature
- **perf:** Performance improvements
- **test:** Adding or updating tests
- **chore:** Changes to build process or auxiliary tools

### Examples

```bash
# Good commit messages
feat(auth): add Google OAuth login
fix(portfolio): resolve calculation error in total value
docs(api): update portfolio endpoints documentation
style(login): improve button spacing and colors
refactor(dashboard): simplify data fetching logic
test(portfolios): add unit tests for portfolio service
chore(deps): update Next.js to v15

# With body and footer
feat(portfolio): add multi-portfolio comparison

Allow users to compare performance across multiple portfolios
with interactive charts and detailed analytics.

Closes #123
```

### Commit Best Practices

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests when relevant
- Write detailed commit messages for complex changes

<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/dark.png" alt="Line">
</div>

## 🔀 Pull Request Process

<p align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzBhMmQxN2VhYjI0YjI0YjI0YjI0YjI0YjI0YjI0YjI0YjI0YjI0YiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/kH6CqYiquZawmU1HI6/giphy.gif" width="400" alt="Pull Request">
</p>

> **Pro Tip:** Small, focused PRs get reviewed faster and are easier to merge!

### Before Submitting

1. **Update your branch** with the latest upstream changes
2. **Test your changes** thoroughly
3. **Run linting:**
   ```bash
   # Frontend
   cd frontend && npm run lint
   
   # Backend
   cd backend && npm run lint
   ```
4. **Update documentation** if needed
5. **Add tests** for new features

### PR Template

When creating a pull request, please use this template:

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Related Issues
Closes #123
Relates to #456

## Changes Made
- List the specific changes made
- Be clear and concise
- Mention affected components/files

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Testing
Describe the tests you ran to verify your changes.

- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari
- [ ] Tested on mobile devices
- [ ] Tested in light mode
- [ ] Tested in dark mode

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or errors
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
```

### Review Process

1. **Automated checks** will run (linting, tests, build)
2. **Maintainers will review** your code
3. **Address feedback** by pushing new commits to your branch
4. Once approved, a maintainer will **merge your PR**

### PR Best Practices

- Keep PRs **small and focused** (one feature/fix per PR)
- Write a **clear and descriptive title**
- **Reference related issues** in the description
- **Respond to feedback** in a timely manner
- Be **respectful and professional** in all communications

<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="Line">
</div>

## 📋 Issue Guidelines

<p align="center">
  <img src="https://media.giphy.com/media/3oKIPsx2VAYAgEHC12/giphy.gif" width="300" alt="Issues">
</p>

### Creating Issues

When creating an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Use the appropriate template** (bug report, feature request, etc.)
3. **Provide clear and descriptive titles**
4. **Include all relevant information**
5. **Add appropriate labels**

### Issue Labels

- **`bug`** - Something isn't working
- **`enhancement`** - New feature or request
- **`documentation`** - Improvements or additions to documentation
- **`good first issue`** - Good for newcomers
- **`help wanted`** - Extra attention is needed
- **`hacktoberfest`** - Issues for Hacktoberfest
- **`priority: high`** - High priority issues
- **`UI/UX`** - User interface and experience improvements
- **`backend`** - Backend-related issues
- **`frontend`** - Frontend-related issues
- **`database`** - Database-related issues

### Working on Issues

1. **Comment on the issue** to let others know you're working on it
2. **Ask questions** if anything is unclear
- **Update the issue** with your progress
- **Link your PR** to the issue when ready

<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/solar.png" alt="Line">
</div>

## 🧪 Testing

<p align="center">
  <img src="https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif" width="300" alt="Testing">
</p>

> **Important:** Always test your changes thoroughly before submitting a PR. It saves everyone time!

### Frontend Testing

```bash
cd frontend
npm run test
```

### Backend Testing

```bash
cd backend
npm run test
# or
pytest
```

### Manual Testing Checklist

When testing your changes, please verify:

- [ ] Functionality works as expected
- [ ] No console errors or warnings
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Works in different browsers (Chrome, Firefox, Safari)
- [ ] Works in both light and dark modes
- [ ] Authentication flows work correctly
- [ ] API endpoints return expected data
- [ ] Error handling works properly
- [ ] Loading states display correctly
- [ ] No performance regressions

<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/grass.png" alt="Line">
</div>

## 📚 Documentation

<p align="center">
  <img src="https://media.giphy.com/media/WFZvB7VIXBgiz3oDXE/giphy.gif" width="350" alt="Documentation">
</p>

> **Documentation is love! ❤️** Good documentation helps everyone understand and use the project better.

Good documentation is crucial for the project's success.

### When to Update Documentation

Update documentation when:

- Adding new features
- Changing existing functionality
- Adding new API endpoints
- Updating dependencies
- Modifying setup/installation steps
- Fixing bugs that affect documentation

### Documentation Files

- **README.md** - Project overview and quick start
- **Backend.md** - Backend API documentation
- **CONTRIBUTING.md** - This file (contribution guidelines)
- **CODE_OF_CONDUCT.md** - Community standards
- **API Documentation** - FastAPI auto-generated docs at `/docs`

### Documentation Standards

- Use clear and concise language
- Include code examples where appropriate
- Keep documentation up-to-date with code changes
- Use proper markdown formatting
- Include screenshots for UI changes
- Explain the "why" not just the "how"

<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" alt="Line">
</div>

## 👥 Community

<p align="center">
  <img src="https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif" width="350" alt="Community">
</p>

### Getting Help

- **GitHub Discussions:** Ask questions and share ideas
- **Stack Overflow:** Tag questions with `stockvision`
- **Email:** Contact maintainers for private concerns
- **Issues:** Check existing issues or create a new one

### Recognition

We value all contributions! Contributors are recognized:

- In the README.md contributors section
- On our GitHub repository
- In release notes for significant contributions

### Hacktoberfest 🎃

<p align="center">
  <img src="https://media.giphy.com/media/l0IynvPneUpb7SnBe/giphy.gif" width="300" alt="Hacktoberfest">
</p>

We participate in Hacktoberfest! Look for issues tagged with `hacktoberfest` to get started.

<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/fire.png" alt="Line">
</div>

## 🎉 Thank You!

<p align="center">
  <img src="https://media.giphy.com/media/ZfK4cXKJTTay1Ava29/giphy.gif" width="400" alt="Thank You">
</p>

Thank you for taking the time to contribute to StockVision! Your contributions help make this project better for everyone.

### Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)

<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/vintage.png" alt="Line">
</div>

<h2 align="center">🌟 Our Amazing Contributors 🌟</h2>

<div align="center">
  <a href="https://github.com/MIHIR2006/StockVision/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=MIHIR2006/StockVision" alt="Contributors" />
  </a>
</div>

<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" alt="Line">
</div>

<p align="center">
  <img src="https://media.giphy.com/media/LnQjpWaON8nhr21vNW/giphy.gif" width="60"> <br>
  <strong>Happy Contributing! 🚀</strong><br>
  <em>If you have any questions or need help, don't hesitate to reach out to the maintainers or community.</em>
</p>

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer" alt="Footer"/>
</div>
