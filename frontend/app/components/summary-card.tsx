
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string;
  change: number;
  changePercent?: number;
  icon?: React.ReactNode;
  className?: string;
}

export function SummaryCard({
  title,
  value,
  change,
  changePercent,
  icon,
  className,
}: SummaryCardProps) {
  const isPositive = change >= 0;

  return (
    <Card className={cn("backdrop-blur-lg bg-card/80 border-primary/10 transition-all hover:shadow-lg", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-bold">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-extrabold transition-all hover:scale-105">{value}</div>
        <div className="flex items-center mt-2">
          <span
            className={cn(
              "flex items-center text-sm px-2 py-1 rounded-full font-medium",
              isPositive ? "bg-gain/20 text-gain" : "bg-loss/20 text-loss"
            )}
          >
            {isPositive ? (
              <ArrowUpIcon className="mr-1 h-3 w-3" />
            ) : (
              <ArrowDownIcon className="mr-1 h-3 w-3" />
            )}
            {isPositive ? "+" : ""}
            {change.toFixed(2)}
            {changePercent ? ` (${Math.abs(changePercent).toFixed(2)}%)` : ""}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
