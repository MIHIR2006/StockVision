"use client";
import { StockData, timeRanges } from "@/data/mock-data";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useTheme } from "./theme-provider-utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface StockChartProps {
  data: StockData[];
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function StockChart({ data, title = "Stock Performance", className, style }: StockChartProps) {
  const [selectedStock, setSelectedStock] = useState<string>(data[0]?.symbol || "");
  const [timeRange, setTimeRange] = useState("1m");
  const { theme } = useTheme();
  
  const isDarkMode = theme === "dark";
  
  const selectedStockData = data.find((stock) => stock.symbol === selectedStock) || data[0];
  
  // Filter history based on time range (for simplicity, we'll just use the full history)
  const chartData = selectedStockData?.history || [];
  
  // Format currency for tooltip
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  // Custom chart colors based on theme
  const chartColors = {
    line: isDarkMode ? "#38BDF8" : "#3b82f6",
    gradient: {
      start: isDarkMode ? "rgba(56, 189, 248, 0.6)" : "rgba(59, 130, 246, 0.6)",
      end: isDarkMode ? "rgba(56, 189, 248, 0)" : "rgba(59, 130, 246, 0)"
    },
    grid: isDarkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(229, 231, 235, 0.5)",
    tooltip: {
      bg: isDarkMode ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
      border: isDarkMode ? "rgba(51, 65, 85, 0.5)" : "rgba(229, 231, 235, 0.5)"
    }
  };
  
  return (
    <Card className={cn("col-span-3 backdrop-blur-lg bg-card/80 border-primary/10 transition-all hover:shadow-lg", className)} style={style}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-xl font-extrabold">{title}</CardTitle>
          <ToggleGroup
            type="single"
            value={selectedStock}
            onValueChange={(value) => {
              if (value) setSelectedStock(value);
            }}
            className="space-x-1"
          >
            {data.map((stock) => (
              <ToggleGroupItem
                key={stock.symbol}
                value={stock.symbol}
                aria-label={stock.name}
                size="sm"
                className="hover:scale-105 transition-transform"
              >
                {stock.symbol}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold">
              ${selectedStockData?.price.toFixed(2)}
            </span>
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                selectedStockData?.change && selectedStockData.change >= 0
                  ? "bg-gain/20 text-gain"
                  : "bg-loss/20 text-loss"
              )}
            >
              {selectedStockData?.change && selectedStockData.change >= 0 ? "+" : ""}
              {selectedStockData?.changePercent.toFixed(2)}%
            </span>
          </div>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => {
              if (value) setTimeRange(value);
            }}
            className="space-x-1"
          >
            {timeRanges.map((range) => (
              <ToggleGroupItem
                key={range.value}
                value={range.value}
                aria-label={range.label}
                size="sm"
                className="hover:scale-105 transition-transform"
              >
                {range.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartColors.gradient.start}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartColors.gradient.end}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.grid}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
                stroke={isDarkMode ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground))"}
              />
              <YAxis
                domain={["dataMin - 5", "dataMax + 5"]}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
                width={60}
                stroke={isDarkMode ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground))"}
              />
              <Tooltip
                formatter={formatCurrency}
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString();
                }}
                contentStyle={{
                  backgroundColor: chartColors.tooltip.bg,
                  borderColor: chartColors.tooltip.border,
                  borderRadius: "var(--radius)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              />
              <ReferenceLine
                y={selectedStockData?.price}
                stroke={chartColors.grid}
                strokeDasharray="3 3"
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColors.line}
                fillOpacity={1}
                fill="url(#colorPrice)"
                strokeWidth={2}
                activeDot={{ r: 6, fill: chartColors.line, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
