
// Mock portfolio data
export type StockData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  shares: number;
  value: number;
  allocation: number;
  history: { date: string; price: number }[];
};

export type PortfolioSummary = {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  totalGain: number;
  totalGainPercent: number;
};

// Generate random historical data
const generateHistory = (
  days: number,
  startPrice: number,
  volatility: number
) => {
  const history: { date: string; price: number }[] = [];
  let currentPrice = startPrice;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const formattedDate = date.toISOString().split("T")[0];

    // Random walk with drift
    const change = (Math.random() - 0.5) * volatility * currentPrice;
    currentPrice = Math.max(0.01, currentPrice + change);

    history.push({
      date: formattedDate,
      price: parseFloat(currentPrice.toFixed(2)),
    });
  }

  return history;
};

// Portfolio stocks
// Legacy portfolio stocks (for backward compatibility)
export const portfolioStocks: StockData[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 174.79,
    change: 1.23,
    changePercent: 0.71,
    marketCap: "2.85T",
    shares: 50,
    value: 8739.5,
    allocation: 28.3,
    history: generateHistory(30, 170, 0.02),
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    price: 338.47,
    change: -2.14,
    changePercent: -0.63,
    marketCap: "2.51T",
    shares: 25,
    value: 8461.75,
    allocation: 27.4,
    history: generateHistory(30, 340, 0.018),
  },
  {
    symbol: "GOOG",
    name: "Alphabet",
    price: 138.96,
    change: 0.57,
    changePercent: 0.41,
    marketCap: "1.74T",
    shares: 30,
    value: 4168.8,
    allocation: 13.5,
    history: generateHistory(30, 135, 0.022),
  },
  {
    symbol: "AMZN",
    name: "Amazon",
    price: 147.03,
    change: -1.45,
    changePercent: -0.98,
    marketCap: "1.52T",
    shares: 40,
    value: 5881.2,
    allocation: 19.0,
    history: generateHistory(30, 150, 0.025),
  },
  {
    symbol: "TSLA",
    name: "Tesla",
    price: 163.57,
    change: 3.79,
    changePercent: 2.37,
    marketCap: "519.82B",
    shares: 22,
    value: 3598.54,
    allocation: 11.8,
    history: generateHistory(30, 155, 0.035),
  },
];

// Portfolio summary
export const portfolioSummary: PortfolioSummary = {
  totalValue: portfolioStocks.reduce((sum, stock) => sum + stock.value, 0),
  dayChange: 134.56,
  dayChangePercent: 0.44,
  totalGain: 7823.45,
  totalGainPercent: 34.12,
};

// Market indices
export const marketIndices = [
  {
    name: "S&P 500",
    value: 4,
    change: 0.45,
    history: generateHistory(30, 4200, 0.01),
  },
  {
    name: "NASDAQ",
    value: 13,
    change: 0.72,
    history: generateHistory(30, 13000, 0.015),
  },
  {
    name: "DOW JONES",
    value: 34,
    change: -0.21,
    history: generateHistory(30, 34000, 0.008),
  },
];

// Recent activities
export const recentActivities = [
  {
    id: 1,
    type: "buy",
    symbol: "AAPL",
    shares: 5,
    price: 174.21,
    date: "2025-04-12",
  },
  {
    id: 2,
    type: "sell",
    symbol: "MSFT",
    shares: 2,
    price: 341.12,
    date: "2025-04-10",
  },
  {
    id: 3,
    type: "dividend",
    symbol: "AAPL",
    amount: 23.50,
    date: "2025-04-05",
  },
  {
    id: 4,
    type: "buy",
    symbol: "GOOG",
    shares: 3,
    price: 137.89,
    date: "2025-04-03",
  },
];

// Time ranges for filters
export const timeRanges = [
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1m' },
  { label: '3M', value: '3m' },
  { label: '1Y', value: '1y' },
  { label: '5Y', value: '5y' },
  { label: 'ALL', value: 'all' }
];

// Portfolio types
export type Portfolio = {
  id: string;
  name: string;
  description?: string;
  totalValue: number;
  totalCost: number;
  dayChange: number;
  dayChangePercent: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  stocks: StockData[];
  createdAt: string;
  updatedAt: string;
};

export type PortfolioHistory = {
  portfolioId: string;
  date: string;
  value: number;
  change: number;
  changePercent: number;
};

// Mock portfolios data
export const mockPortfolios: Portfolio[] = [
  {
    id: "portfolio-1",
    name: "Long-Term Growth",
    description: "Conservative long-term investment strategy focused on blue-chip stocks",
    totalValue: 45000,
    totalCost: 38000,
    dayChange: 234.50,
    dayChangePercent: 0.52,
    totalGainLoss: 7000,
    totalGainLossPercent: 18.42,
    stocks: [
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        price: 174.79,
        change: 1.23,
        changePercent: 0.71,
        marketCap: "2.85T",
        shares: 50,
        value: 8739.5,
        allocation: 19.4,
        history: generateHistory(30, 170, 0.02),
      },
      {
        symbol: "MSFT",
        name: "Microsoft",
        price: 338.47,
        change: -2.14,
        changePercent: -0.63,
        marketCap: "2.51T",
        shares: 40,
        value: 13538.8,
        allocation: 30.1,
        history: generateHistory(30, 340, 0.018),
      },
      {
        symbol: "GOOG",
        name: "Alphabet",
        price: 138.96,
        change: 0.57,
        changePercent: 0.41,
        marketCap: "1.74T",
        shares: 60,
        value: 8337.6,
        allocation: 18.5,
        history: generateHistory(30, 135, 0.022),
      },
    ],
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "portfolio-2",
    name: "Trading Account",
    description: "Active trading portfolio for short-term gains",
    totalValue: 25000,
    totalCost: 23000,
    dayChange: -156.75,
    dayChangePercent: -0.62,
    totalGainLoss: 2000,
    totalGainLossPercent: 8.70,
    stocks: [
      {
        symbol: "TSLA",
        name: "Tesla",
        price: 163.57,
        change: 3.79,
        changePercent: 2.37,
        marketCap: "519.82B",
        shares: 30,
        value: 4907.1,
        allocation: 19.6,
        history: generateHistory(30, 155, 0.035),
      },
      {
        symbol: "NVDA",
        name: "NVIDIA",
        price: 445.67,
        change: 12.34,
        changePercent: 2.85,
        marketCap: "1.1T",
        shares: 25,
        value: 11141.75,
        allocation: 44.6,
        history: generateHistory(30, 430, 0.04),
      },
      {
        symbol: "AMD",
        name: "Advanced Micro Devices",
        price: 95.23,
        change: -1.45,
        changePercent: -1.50,
        marketCap: "154.2B",
        shares: 50,
        value: 4761.5,
        allocation: 19.0,
        history: generateHistory(30, 97, 0.03),
      },
    ],
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "portfolio-3",
    name: "Tech Focus",
    description: "Technology sector concentrated portfolio",
    totalValue: 32000,
    totalCost: 26800,
    dayChange: 445.20,
    dayChangePercent: 1.41,
    totalGainLoss: 5200,
    totalGainLossPercent: 19.40,
    stocks: [
      {
        symbol: "META",
        name: "Meta Platforms",
        price: 198.45,
        change: 4.23,
        changePercent: 2.18,
        marketCap: "503.2B",
        shares: 40,
        value: 7938,
        allocation: 24.8,
        history: generateHistory(30, 190, 0.025),
      },
      {
        symbol: "NFLX",
        name: "Netflix",
        price: 425.30,
        change: 8.75,
        changePercent: 2.10,
        marketCap: "189.4B",
        shares: 20,
        value: 8506,
        allocation: 26.6,
        history: generateHistory(30, 410, 0.03),
      },
      {
        symbol: "GOOGL",
        name: "Alphabet Class A",
        price: 140.25,
        change: 2.15,
        changePercent: 1.56,
        marketCap: "1.75T",
        shares: 55,
        value: 7713.75,
        allocation: 24.1,
        history: generateHistory(30, 137, 0.022),
      },
    ],
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Generate portfolio history
export const generatePortfolioHistory = (portfolioId: string, days: number = 90): PortfolioHistory[] => {
  const portfolio = mockPortfolios.find(p => p.id === portfolioId);
  if (!portfolio) return [];
  
  const history: PortfolioHistory[] = [];
  let currentValue = portfolio.totalValue;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Simulate value fluctuation
    const variation = (Math.random() - 0.5) * 0.03; // ±1.5% daily variation
    const change = currentValue * variation;
    currentValue = Math.max(1000, currentValue + change); // Minimum value of $1000
    
    const changePercent = (change / (currentValue - change)) * 100;
    
    history.push({
      portfolioId,
      date: date.toISOString().split('T')[0],
      value: Math.round(currentValue * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
    });
  }
  
  return history;
};
