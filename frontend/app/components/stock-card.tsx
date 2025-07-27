
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import { StockData } from "@/data/mock-data";

interface StockCardProps {
  stock: StockData;
  className?: string;
  style?: React.CSSProperties;
}

export function StockCard({ stock, className, style }: StockCardProps) {
  const isPositive = stock.change >= 0;

  return (
    <Card className={cn("h-full glass-card", className)} style={style}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          {stock.symbol}
          <span className="text-xs font-normal text-muted-foreground">{stock.name}</span>
        </CardTitle>
        <div className="text-xs text-muted-foreground">
          {stock.shares} shares
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-xl font-extrabold">${stock.price.toFixed(2)}</div>
          <div
            className={cn(
              "flex items-center text-xs font-medium px-2 py-1 rounded-full",
              isPositive ? "bg-gain/20 text-gain" : "bg-loss/20 text-loss"
            )}
          >
            {isPositive ? (
              <ArrowUpIcon className="mr-1 h-3 w-3" />
            ) : (
              <ArrowDownIcon className="mr-1 h-3 w-3" />
            )}
            {Math.abs(stock.changePercent).toFixed(2)}%
          </div>
        </div>
        <div className="mt-4 text-xs font-medium">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Value:</span>
            <span className="font-bold">${stock.value.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-muted-foreground">Market Cap:</span>
            <span className="font-bold">{stock.marketCap}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
