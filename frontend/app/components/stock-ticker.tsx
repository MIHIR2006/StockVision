'use client';

import { portfolioStocks } from "@/data/mock-data";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

interface StockTickerProps {
  // Speed in pixels per second
  speedPxPerSecond?: number;
}

export function StockTicker({ speedPxPerSecond = 30 }: StockTickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const positionRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const contentWidthRef = useRef<number>(0);
  const lastTsRef = useRef<number | null>(null);

  // Double the stocks to create a continuous loop
  const tickerStocks = useMemo(() => [...portfolioStocks, ...portfolioStocks], []);

  useEffect(() => {
    const step = (ts?: number) => {
      const contentWidth = contentWidthRef.current;
      if (!contentWidth) {
        animationFrameRef.current = requestAnimationFrame(step);
        return;
      }
      const now = ts ?? performance.now();
      const last = lastTsRef.current ?? now;
      const deltaMs = now - last;
      lastTsRef.current = now;
      const pixelsThisFrame = (speedPxPerSecond * deltaMs) / 1000;
      positionRef.current -= pixelsThisFrame;
      // Reset seamlessly when fully scrolled
      if (Math.abs(positionRef.current) >= contentWidth / 2) {
        positionRef.current = 0;
      }
      if (contentRef.current) {
        contentRef.current.style.transform = `translateX(${positionRef.current}px)`;
      }
      animationFrameRef.current = requestAnimationFrame(step);
    };

    // Measure content width once mounted
    const measure = () => {
      if (contentRef.current) {
        contentWidthRef.current = contentRef.current.scrollWidth;
      }
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });
    animationFrameRef.current = requestAnimationFrame(step);
    return () => {
      window.removeEventListener('resize', measure);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-hidden border-y backdrop-blur-lg bg-background/50 py-2">
      <div ref={contentRef} className="flex whitespace-nowrap will-change-transform select-none">
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
