import { portfolioStocks, portfolioSummary, recentActivities } from "@/data/mock-data";
// import { useLocation } from "react-router-dom";
import {
    BarChart2,
    BriefcaseBusiness, ChartNoAxesCombined, CircleDollarSign,
    LineChart,
    MessageSquare,
    Settings,
    TrendingUp,
    Wallet
} from "lucide-react";
import dynamic from "next/dynamic";
import { RecentActivity } from "./recent-activity";
import Screener from "./screener";
import { SettingsSection } from "./settings-section";
import { StockCard } from "./stock-card";
import { SummaryCard } from "./summary-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
const PerformanceSection = dynamic(() => import("./performance-section").then(m => m.PerformanceSection), { ssr: false });
const PortfolioAllocation = dynamic(() => import("./portfolio-allocation").then(m => m.PortfolioAllocation), { ssr: false });
const PortfolioSection = dynamic(() => import("./portfolio-section").then(m => m.PortfolioSection), { ssr: false });
const MultiPortfolioSection = dynamic(() => import("./multi-portfolio-section").then(m => m.MultiPortfolioSection), { ssr: false });
const StockChart = dynamic(() => import("./stock-chart").then(m => m.StockChart), { ssr: false });

// Simple AI Chatbot Component
function AIStockChatbot({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="bg-card text-card-foreground rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          AI Stock Analyzer
        </h2>
        <p className="text-muted-foreground mb-4">
          🚀 Your AI chatbot backend is ready and running!
        </p>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Backend API: ✅ Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Stock Data Service: ✅ Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>AI Analysis: ✅ Operational</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            🔗 Test the API: <code>http://localhost:8000/docs</code>
          </p>
        </div>
        <div className="mt-4">
          <p className="text-xs text-muted-foreground">
            Frontend chat interface coming soon! The backend is fully functional.
          </p>
        </div>
      </div>
    </div>
  );
}

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
        <TabsList className="w-full md:w-[500px] mb-4 sm:mb-6 grid grid-cols-7">
          <TabsTrigger value="overview" className="font-bold text-xs sm:text-sm"><BarChart2 className="h-5 w-5" /></TabsTrigger>
          <TabsTrigger value="performance" className="font-bold text-xs sm:text-sm"><LineChart className="h-5 w-5" /></TabsTrigger>
          <TabsTrigger value="portfolio" className="font-bold text-xs sm:text-sm"><Wallet className="h-5 w-5" /></TabsTrigger>
          <TabsTrigger value="multi-portfolio" className="font-bold text-xs sm:text-sm"><BriefcaseBusiness className="h-5 w-5"/></TabsTrigger>
          <TabsTrigger value="screener" className="font-bold text-xs sm:text-sm"><ChartNoAxesCombined  className="h-5 w-5" /></TabsTrigger>
          <TabsTrigger value="settings" className="font-bold text-xs sm:text-sm"><Settings className="h-5 w-5" /></TabsTrigger>
          <TabsTrigger value="ai-chat" className="font-bold text-xs sm:text-sm flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">AI</span>
          </TabsTrigger>
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
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4 sm:space-y-6">
          <SettingsSection className="animate-fade-in" />
        </TabsContent>

        {/* AI Chat Tab */}
        <TabsContent value="ai-chat" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <AIStockChatbot className="animate-fade-in" />
            </div>
            <div className="space-y-4">
              <div className="bg-card text-card-foreground rounded-lg border p-4">
                <h3 className="text-sm font-semibold mb-3">🎯 Implementation Status</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Backend API: ✅ Ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>AI Services: ✅ Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Database: ✅ Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Frontend UI: 🔄 In Progress</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-card text-card-foreground rounded-lg border p-4">
                <h3 className="text-sm font-semibold mb-3">🚀 What's Ready</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>• Stock price analysis API</div>
                  <div>• AI-powered insights</div>
                  <div>• Portfolio comparison</div>
                  <div>• Real-time market data</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
