# Multi-Portfolio & Historical Comparison Feature

## Overview

The Multi-Portfolio & Historical Comparison feature allows users to create, manage, and compare multiple investment portfolios within StockVision. This feature provides comprehensive portfolio management capabilities with interactive comparison tools.

## Key Features

### 1. Multi-Portfolio Management
- **Create Multiple Portfolios**: Users can create unlimited named portfolios (e.g., "Long-Term Growth", "Trading Account", "Tech Focus")
- **Portfolio Switching**: Easy switching between portfolios via dropdown selector
- **Portfolio Metadata**: Each portfolio includes name, description, creation date, and performance metrics

### 2. Portfolio Comparison
- **Interactive Charts**: Side-by-side performance comparison with interactive area charts
- **Flexible Selection**: Choose any combination of portfolios to compare
- **Time Range Filters**: Compare performance over 7 days, 30 days, 90 days, or 1 year
- **Performance Metrics**: Compare total value, daily changes, and overall returns

### 3. Combined Analytics
- **Aggregate View**: See combined value across all portfolios
- **Performance Rankings**: Identify best and worst performing portfolios
- **Risk Analysis**: Understand portfolio diversification and risk distribution

## Technical Implementation

### Backend (FastAPI)

#### New Models
```python
class Portfolio(BaseModel):
    id: str
    name: str
    description: Optional[str]
    total_value: float
    total_cost: float
    day_change: float
    day_change_percent: float
    total_gain_loss: float
    total_gain_loss_percent: float
    stocks: List[PortfolioStock]
    created_at: datetime
    updated_at: datetime

class PortfolioHistory(BaseModel):
    portfolio_id: str
    date: str
    value: float
    change: float
    change_percent: float
```

#### API Endpoints
- `GET /api/portfolios/` - Get all portfolios
- `POST /api/portfolios/` - Create new portfolio
- `GET /api/portfolios/{id}` - Get specific portfolio
- `PUT /api/portfolios/{id}` - Update portfolio
- `DELETE /api/portfolios/{id}` - Delete portfolio
- `GET /api/portfolios/{id}/history` - Get portfolio historical data
- `POST /api/portfolios/compare` - Compare multiple portfolios
- `GET /api/portfolios/analytics/summary` - Get combined analytics

### Frontend (Next.js + TypeScript)

#### New Components

1. **PortfolioSelector** (`portfolio-selector.tsx`)
   - Dropdown for portfolio selection
   - Create new portfolio dialog
   - Portfolio summary display

2. **PortfolioComparison** (`portfolio-comparison.tsx`)
   - Interactive comparison charts
   - Portfolio selection checkboxes
   - Performance summary cards

3. **MultiPortfolioSection** (`multi-portfolio-section.tsx`)
   - Main container with tabbed interface
   - Overview, Individual, and Comparison tabs
   - Combined analytics dashboard

#### Custom Hooks
- `usePortfolios()` - Portfolio state management with API integration
- Automatic fallback to mock data when API is unavailable

#### API Integration
- `portfolio-api.ts` - Service layer for backend communication
- Error handling and fallback mechanisms
- TypeScript interfaces for type safety

## User Interface

### Navigation
The feature is accessible via a new "Multi-Portfolio" tab in the main dashboard navigation.

### Three Main Views

1. **Overview Tab**
   - Combined portfolio statistics
   - Portfolio grid with key metrics
   - Best/worst performer highlights

2. **Individual Tab**
   - Portfolio selector dropdown
   - Detailed view of selected portfolio
   - Traditional portfolio section integration

3. **Comparison Tab**
   - Portfolio selection interface
   - Interactive comparison charts
   - Performance summary cards

## Usage Examples

### Creating a New Portfolio
1. Navigate to Multi-Portfolio → Individual tab
2. Click "New" button in portfolio selector
3. Enter portfolio name and description
4. Click "Create Portfolio"

### Comparing Portfolios
1. Navigate to Multi-Portfolio → Comparison tab
2. Select portfolios to compare using checkboxes
3. Choose time range (7d, 30d, 90d, 1y)
4. View interactive comparison chart and metrics

### Viewing Combined Analytics
1. Navigate to Multi-Portfolio → Overview tab
2. See total value across all portfolios
3. Identify best and worst performers
4. Review individual portfolio cards

## Data Flow

```
Frontend Components
       ↓
usePortfolios Hook
       ↓
Portfolio API Service
       ↓
FastAPI Backend
       ↓
Mock Data / Database
```

## Error Handling

- **API Unavailable**: Automatic fallback to mock data
- **Network Errors**: User-friendly error messages
- **Loading States**: Spinner indicators during data fetching
- **Empty States**: Helpful messages when no portfolios exist

## Performance Considerations

- **Lazy Loading**: Components load data only when needed
- **Caching**: API responses cached to reduce server load
- **Optimistic Updates**: UI updates immediately for better UX
- **Efficient Rendering**: React optimization techniques used

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live portfolio updates
2. **Advanced Analytics**: Risk metrics, Sharpe ratio, beta calculations
3. **Portfolio Optimization**: AI-powered rebalancing suggestions
4. **Export Features**: PDF reports and CSV data export
5. **Alerts**: Performance-based notifications and alerts
6. **Mobile Optimization**: Responsive design improvements

## Testing

### Backend Testing
Run the test script to verify API endpoints:
```bash
cd backend
python test_portfolios.py
```

### Frontend Testing
The frontend includes error boundaries and fallback mechanisms to ensure reliability even when the backend is unavailable.

## Installation & Setup

1. **Backend Setup**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the Feature**:
   - Open http://localhost:3000
   - Navigate to Dashboard → Multi-Portfolio tab

## Configuration

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL (defaults to http://localhost:8000)

### Mock Data
The feature includes comprehensive mock data for development and testing, ensuring the UI works even without a backend connection.

## Conclusion

The Multi-Portfolio & Historical Comparison feature significantly enhances StockVision's capabilities, providing users with professional-grade portfolio management tools. The implementation follows best practices for both backend and frontend development, ensuring scalability, maintainability, and excellent user experience.