
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
