import { portfolioStocks, portfolioSummary, recentActivities } from "@/data/mock-data";
import { CircleDollarSign, TrendingUp, Wallet } from "lucide-react";
// import { useLocation } from "react-router-dom";
import { PerformanceSection } from "./performance-section";
import { PortfolioAllocation } from "./portfolio-allocation";
import { PortfolioSection } from "./portfolio-section";
import { MultiPortfolioSection } from "./multi-portfolio-section";
import { RecentActivity } from "./recent-activity";
import { SettingsSection } from "./settings-section";
import { StockCard } from "./stock-card";
import { StockChart } from "./stock-chart";
import { SummaryCard } from "./summary-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import Screener from "./screener";

// Define the Activity type to match what RecentActivity component expects
type Activity = {
  id: number;
  type: "buy" | "sell" | "dividend";
  symbol: string;
  shares?: number;
  price?: number;
  amount?: number;
  date: string;
};

interface DashboardProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Dashboard({ activeSection, onSectionChange }: DashboardProps) {
  // Cast the activities to the correct type
  const typedActivities = recentActivities as Activity[];

  return (
    <div className="w-full px-2 sm:px-4 py-4 sm:py-6 space-y-6 animate-fade-in max-w-full">
      <Tabs value={activeSection} onValueChange={onSectionChange} className="w-full">
        <TabsList className="w-full md:w-[600px] mb-4 sm:mb-6 grid grid-cols-6">
          <TabsTrigger value="overview" className="font-bold text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="performance" className="font-bold text-xs sm:text-sm">Performance</TabsTrigger>
          <TabsTrigger value="portfolio" className="font-bold text-xs sm:text-sm">Portfolio</TabsTrigger>
          <TabsTrigger value="multi-portfolio" className="font-bold text-xs sm:text-sm">Multi-Portfolio</TabsTrigger>
          <TabsTrigger value="screener" className="font-bold text-xs sm:text-sm">Screener</TabsTrigger>
          <TabsTrigger value="settings" className="font-bold text-xs sm:text-sm">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
            <SummaryCard
              title="Portfolio Value"
              value={`$${portfolioSummary.totalValue.toLocaleString()}`}
              change={portfolioSummary.dayChange}
              changePercent={portfolioSummary.dayChangePercent}
              icon={<CircleDollarSign className="h-4 w-4 text-muted-foreground" />}
            />
            <SummaryCard
              title="Daily Change"
              value={`$${portfolioSummary.dayChange.toLocaleString()}`}
              change={portfolioSummary.dayChange}
              changePercent={portfolioSummary.dayChangePercent}
              icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            />
            <SummaryCard
              title="Total Gain/Loss"
              value={`$${portfolioSummary.totalGain.toLocaleString()}`}
              change={portfolioSummary.totalGain}
              changePercent={portfolioSummary.totalGainPercent}
              icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-4">
            <StockChart
              data={portfolioStocks}
              title="Stock Performance"
              className="lg:col-span-3 animate-slide-in glass-card"
            />
            <div className="space-y-4 lg:col-span-1 animate-slide-in" style={{ animationDelay: "0.2s" }}>
              <PortfolioAllocation stocks={portfolioStocks} />
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {portfolioStocks.slice(0, 3).map((stock, index) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                className="animate-slide-in"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              />
            ))}
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            <RecentActivity
              activities={typedActivities}
              className="animate-slide-in"
              style={{ animationDelay: "0.2s" }}
            />
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              {portfolioStocks.slice(3, 5).map((stock, index) => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  className="animate-slide-in"
                  style={{ animationDelay: `${0.3 + (0.1 * index)}s` }}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4 sm:space-y-6">
          <PerformanceSection className="animate-fade-in" />
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-4 sm:space-y-6">
          <PortfolioSection className="animate-fade-in" />
        </TabsContent>

        {/* Multi-Portfolio Tab */}
        <TabsContent value="multi-portfolio" className="space-y-4 sm:space-y-6">
          <MultiPortfolioSection className="animate-fade-in" />
        </TabsContent>

        {/* Screener Tab */}
        <TabsContent value="screener" className="space-y-4 sm:space-y-6">
          <Screener />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4 sm:space-y-6">
          <SettingsSection className="animate-fade-in" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
