"use client";

import { BarChart3, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Portfolio } from "./portfolio-selector";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ComparisonData {
  date: string;
  [portfolioName: string]: number | string;
}

interface PortfolioComparisonProps {
  portfolios: Portfolio[];
  className?: string;
}

const timeRanges = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
  { label: "1 Year", value: "1y" },
];

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

// Function to get color based on portfolio value (red for lower, blue for higher)
const getColorByValue = (portfolios: Portfolio[], selectedPortfolios: string[]) => {
  const selectedPortfolioData = selectedPortfolios
    .map(id => portfolios.find(p => p.id === id))
    .filter(Boolean) as Portfolio[];
  
  if (selectedPortfolioData.length === 0) return {};
  
  // Sort portfolios by total value
  const sortedPortfolios = [...selectedPortfolioData].sort((a, b) => a.totalValue - b.totalValue);
  
  const colorMap: { [key: string]: string } = {};
  
  selectedPortfolioData.forEach(portfolio => {
    const index = sortedPortfolios.findIndex(p => p.id === portfolio.id);
    const ratio = index / (sortedPortfolios.length - 1);
    
    // Interpolate between red (lower values) and blue (higher values)
    if (sortedPortfolios.length === 1) {
      colorMap[portfolio.id] = "#3b82f6"; // Default blue for single portfolio
    } else {
      // Red to Blue gradient: red (0, 0) -> blue (0, 0, 255)
      const red = Math.round(220 * (1 - ratio)); // Start with red, fade to 0
      const blue = Math.round(59 + 196 * ratio); // Start with some blue, increase to 255
      colorMap[portfolio.id] = `rgb(${red}, 0, ${blue})`;
    }
  });
  
  return colorMap;
};

export function PortfolioComparison({ portfolios, className }: PortfolioComparisonProps) {
  const [selectedPortfolios, setSelectedPortfolios] = useState<string[]>(
    portfolios.slice(0, 2).map(p => p.id)
  );
  const [timeRange, setTimeRange] = useState("90d");

  // Mock comparison data generation
  const generateComparisonData = (): ComparisonData[] => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : 365;
    const data: ComparisonData[] = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dataPoint: ComparisonData = {
        date: date.toISOString().split('T')[0]
      };
      
      selectedPortfolios.forEach((portfolioId) => {
        const portfolio = portfolios.find(p => p.id === portfolioId);
        if (portfolio) {
          // Simulate historical values with some randomness
          const baseValue = portfolio.totalValue;
          const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
          const timeDecay = (days - i) / days; // Earlier dates have more variation
          dataPoint[portfolio.name] = Math.round(baseValue * (1 + variation * timeDecay));
        }
      });
      
      data.push(dataPoint);
    }
    
    return data;
  };

  const comparisonData = generateComparisonData();

  const handlePortfolioToggle = (portfolioId: string, checked: boolean) => {
    if (checked) {
      setSelectedPortfolios(prev => [...prev, portfolioId]);
    } else {
      setSelectedPortfolios(prev => prev.filter(id => id !== portfolioId));
    }
  };

  // Get colors based on portfolio values
  const valueBasedColors = getColorByValue(portfolios, selectedPortfolios);
  
  const chartConfig: ChartConfig = selectedPortfolios.reduce((config, portfolioId) => {
    const portfolio = portfolios.find(p => p.id === portfolioId);
    if (portfolio) {
      config[portfolio.name] = {
        label: portfolio.name,
        color: valueBasedColors[portfolioId] || "#3b82f6", // Default blue if no color found
      };
    }
    return config;
  }, {} as ChartConfig);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Portfolio Comparison
              </CardTitle>
              <CardDescription>
                Compare performance across multiple portfolios
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Portfolio Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Select Portfolios to Compare</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {portfolios.map((portfolio) => (
                <div
                  key={portfolio.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={portfolio.id}
                    checked={selectedPortfolios.includes(portfolio.id)}
                    onCheckedChange={(checked) => 
                      handlePortfolioToggle(portfolio.id, checked as boolean)
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={portfolio.id}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {portfolio.name}
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        ${portfolio.totalValue.toLocaleString()}
                      </span>
                      <Badge
                        variant={portfolio.totalGainLossPercent >= 0 ? "success" : "destructive"}
                        className="text-xs"
                      >
                        {portfolio.totalGainLossPercent >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(portfolio.totalGainLossPercent).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Chart */}
          {selectedPortfolios.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Performance Comparison</h4>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <AreaChart data={comparisonData}>
                  <defs>
                    {selectedPortfolios.map((portfolioId) => {
                      const portfolio = portfolios.find(p => p.id === portfolioId);
                      if (!portfolio) return null;
                      const portfolioColor = valueBasedColors[portfolioId] || "#3b82f6";
                      return (
                        <linearGradient
                          key={portfolio.name}
                          id={`fill${portfolio.name.replace(/\s+/g, '')}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={portfolioColor}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={portfolioColor}
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      );
                    })}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          });
                        }}
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
                      />
                    }
                  />
                  {selectedPortfolios.map((portfolioId) => {
                    const portfolio = portfolios.find(p => p.id === portfolioId);
                    if (!portfolio) return null;
                    const portfolioColor = valueBasedColors[portfolioId] || "#3b82f6";
                    return (
                      <Area
                        key={portfolio.name}
                        type="monotone"
                        dataKey={portfolio.name}
                        stroke={portfolioColor}
                        fill={`url(#fill${portfolio.name.replace(/\s+/g, '')})`}
                        strokeWidth={2}
                      />
                    );
                  })}
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </div>
          )}

          {/* Performance Summary */}
          {selectedPortfolios.length > 1 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Performance Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedPortfolios.map((portfolioId) => {
                  const portfolio = portfolios.find(p => p.id === portfolioId);
                  if (!portfolio) return null;
                  
                  return (
                    <Card key={portfolio.id} className="p-4">
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">{portfolio.name}</h5>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Value</span>
                            <span className="font-medium">
                              ${portfolio.totalValue.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Daily</span>
                            <span className={`font-medium ${
                              portfolio.dayChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {portfolio.dayChangePercent >= 0 ? '+' : ''}
                              {portfolio.dayChangePercent.toFixed(2)}%
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Total</span>
                            <span className={`font-medium ${
                              portfolio.totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {portfolio.totalGainLossPercent >= 0 ? '+' : ''}
                              {portfolio.totalGainLossPercent.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {selectedPortfolios.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select at least one portfolio to view comparison</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}