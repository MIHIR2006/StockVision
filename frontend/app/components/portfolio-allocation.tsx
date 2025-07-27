
import { StockData } from "@/data/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

interface PortfolioAllocationProps {
  stocks: StockData[];
  className?: string;
}

const COLORS = [
  "#4E97F5", // Primary blue
  "#22C55E", // Green
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#8B5CF6", // Purple
  "#10B981", // Emerald
  "#EF4444", // Red
  "#6366F1", // Indigo
];

export function PortfolioAllocation({ stocks, className }: PortfolioAllocationProps) {
  const data = stocks.map((stock) => ({
    name: stock.symbol,
    value: stock.allocation,
  }));

  return (
    <Card className={cn("backdrop-blur-lg bg-card/80 border-primary/10 transition-all hover:shadow-lg glass-card", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-extrabold">Portfolio Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  percent,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = 25 + innerRadius + (outerRadius - innerRadius);
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill={COLORS[index % COLORS.length]}
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      style={{ fontSize: "12px", fontWeight: "bold" }}
                    >
                      {`${data[index].name} ${(percent * 100).toFixed(1)}%`}
                    </text>
                  );
                }}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    stroke="rgba(255, 255, 255, 0.2)"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, "Allocation"]}
                contentStyle={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  backdropFilter: "blur(8px)",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  padding: "8px 12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
