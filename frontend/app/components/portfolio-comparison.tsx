'use client';

import { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ResponsiveContainer, 
  LineChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Line 
} from 'recharts';

// Mock data for portfolio performance
const mockPerformanceData = {
  1: [
    { date: '2023-01-01', value: 10000 },
    { date: '2023-02-01', value: 10500 },
    { date: '2023-03-01', value: 11000 },
  ],
  2: [
    { date: '2023-01-01', value: 5000 },
    { date: '2023-02-01', value: 5200 },
    { date: '2023-03-01', value: 5500 },
  ],
  3: [
    { date: '2023-01-01', value: 2000 },
    { date: '2023-02-01', value: 2100 },
    { date: '2023-03-01', value: 2050 },
  ],
};

interface Portfolio {
  id: number;
  name: string;
}

interface PortfolioComparisonProps {
  portfolios: Portfolio[];
}

const lineColors = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#387908', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'
];

export function PortfolioComparison({ portfolios }: PortfolioComparisonProps) {
  const [selectedPortfolios, setSelectedPortfolios] = useState<number[]>([]);

  const handlePortfolioSelection = (portfolioId: number) => {
    if (selectedPortfolios.includes(portfolioId)) {
      setSelectedPortfolios(selectedPortfolios.filter((id) => id !== portfolioId));
    } else {
      setSelectedPortfolios([...selectedPortfolios, portfolioId]);
    }
  };

  const chartData = useMemo(() => {
    const chartData = {};
    selectedPortfolios.forEach((portfolioId) => {
      const portfolioData = mockPerformanceData[portfolioId];
      if (portfolioData) {
        portfolioData.forEach((dataPoint) => {
          if (!chartData[dataPoint.date]) {
            chartData[dataPoint.date] = { date: dataPoint.date };
          }
          chartData[dataPoint.date][portfolioId] = dataPoint.value;
        });
      }
    });
    return Object.values(chartData);
  }, [selectedPortfolios]);

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Comparison</CardTitle>
          <CardDescription>Select portfolios to compare their performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            {portfolios.map((portfolio) => (
              <div key={portfolio.id} className="flex items-center gap-2">
                <Checkbox
                  id={`portfolio-${portfolio.id}`}
                  checked={selectedPortfolios.includes(portfolio.id)}
                  onCheckedChange={() => handlePortfolioSelection(portfolio.id)}
                />
                <label htmlFor={`portfolio-${portfolio.id}`}>{portfolio.name}</label>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedPortfolios.map((portfolioId, index) => {
                const portfolio = portfolios.find((p) => p.id === portfolioId);
                return (
                  <Line
                    key={portfolioId}
                    type="monotone"
                    dataKey={portfolioId}
                    name={portfolio?.name || `Portfolio ${portfolioId}`}
                    stroke={lineColors[index % lineColors.length]}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
