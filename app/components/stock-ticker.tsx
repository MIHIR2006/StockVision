'use client';

import { portfolioStocks } from "@/data/mock-data";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function StockTicker() {
  const [scrollPosition, setScrollPosition] = useState(0);

  // Auto-scroll the ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prevPosition) => {
        // Reset when it's scrolled enough
        if (prevPosition < -2000) {
          return 0;
        }
        return prevPosition - 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Double the stocks to create a continuous loop
  const tickerStocks = [...portfolioStocks, ...portfolioStocks];

  return (
    <div className="w-full overflow-hidden border-y backdrop-blur-lg bg-background/50 py-2">
      <div 
        className="flex whitespace-nowrap" 
        style={{ transform: `translateX(${scrollPosition}px)` }}
      >
        {tickerStocks.map((stock, index) => (
          <div 
            key={`${stock.symbol}-${index}`} 
            className="flex items-center mx-4 animate-fade-in"
          >
            <span className="font-bold">{stock.symbol}</span>
            <span className="mx-2">${stock.price.toFixed(2)}</span>
            <span 
              className={cn(
                "flex items-center",
                stock.change >= 0 ? "text-green-500" : "text-red-500"
              )}
            >
              {stock.change >= 0 ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              {stock.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
