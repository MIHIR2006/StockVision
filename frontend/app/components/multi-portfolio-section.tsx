"use client";

import { useState } from "react";
import { PortfolioSelector, Portfolio } from "./portfolio-selector";
import { PortfolioComparison } from "./portfolio-comparison";
import { PortfolioSection } from "./portfolio-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Wallet, BarChart3, PieChart, Loader2 } from "lucide-react";
import { usePortfolios } from "@/hooks/use-portfolios";

interface MultiPortfolioSectionProps {
  className?: string;
}

export function MultiPortfolioSection({ className }: MultiPortfolioSectionProps) {
  const { portfolios, loading, error, createPortfolio } = usePortfolios();
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("");

  // Set initial selected portfolio when portfolios load
  useState(() => {
    if (portfolios.length > 0 && !selectedPortfolio) {
      setSelectedPortfolio(portfolios[0].id);
    }
  });

  const handleCreatePortfolio = async (name: string, description?: string) => {
    try {
      const newPortfolio = await createPortfolio({ name, description });
      setSelectedPortfolio(newPortfolio.id);
    } catch (err) {
      console.error('Failed to create portfolio:', err);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading portfolios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-red-500 mb-2">Error loading portfolios</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground mb-4">No portfolios found</p>
        <PortfolioSelector
          portfolios={[]}
          selectedPortfolio=""
          onPortfolioChange={() => {}}
          onCreatePortfolio={handleCreatePortfolio}
        />
      </div>
    );
  }

  // Calculate combined analytics
  const combinedAnalytics = {
    totalValue: portfolios.reduce((sum, p) => sum + (p.totalValue || 0), 0),
    totalDayChange: portfolios.reduce((sum, p) => sum + (p.dayChange || 0), 0),
    totalGainLoss: portfolios.reduce((sum, p) => sum + (p.totalGainLoss || 0), 0),
    bestPerformer: portfolios.length > 0 ? portfolios.reduce((best, current) => 
      (current.totalGainLossPercent || 0) > (best.totalGainLossPercent || 0) ? current : best, portfolios[0]
    ) : null,
    worstPerformer: portfolios.length > 0 ? portfolios.reduce((worst, current) => 
      (current.totalGainLossPercent || 0) < (worst.totalGainLossPercent || 0) ? current : worst, portfolios[0]
    ) : null,
  };

  const combinedDayChangePercent = combinedAnalytics.totalValue > 0 
    ? (combinedAnalytics.totalDayChange / combinedAnalytics.totalValue) * 100 
    : 0;

  const combinedGainLossPercent = (combinedAnalytics.totalValue - combinedAnalytics.totalGainLoss) > 0
    ? (combinedAnalytics.totalGainLoss / (combinedAnalytics.totalValue - combinedAnalytics.totalGainLoss)) * 100
    : 0;

  return (
    <div className={className}>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Individual
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Compare
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Portfolios</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{portfolios.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active investment portfolios
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Combined Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${combinedAnalytics.totalValue.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {combinedDayChangePercent >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={combinedDayChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {combinedDayChangePercent >= 0 ? '+' : ''}
                    {combinedDayChangePercent.toFixed(2)}% today
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Return</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${combinedAnalytics.totalGainLoss.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {combinedGainLossPercent >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={combinedGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {combinedGainLossPercent >= 0 ? '+' : ''}
                    {combinedGainLossPercent.toFixed(2)}% overall
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Performer</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{combinedAnalytics.bestPerformer?.name || 'N/A'}</div>
                {combinedAnalytics.bestPerformer && (
                  <Badge variant="success" className="text-xs">
                    +{combinedAnalytics.bestPerformer.totalGainLossPercent.toFixed(2)}%
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {portfolios.map((portfolio) => (
              <Card key={portfolio.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{portfolio.name}</CardTitle>
                    <Badge
                      variant={portfolio.dayChangePercent >= 0 ? "success" : "destructive"}
                    >
                      {portfolio.dayChangePercent >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(portfolio.dayChangePercent).toFixed(2)}%
                    </Badge>
                  </div>
                  {portfolio.description && (
                    <CardDescription className="text-xs">
                      {portfolio.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Value</span>
                    <span className="font-semibold">
                      ${portfolio.totalValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Daily Change</span>
                    <span className={`text-sm font-medium ${
                      portfolio.dayChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {portfolio.dayChange >= 0 ? '+' : ''}
                      ${Math.abs(portfolio.dayChange).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Return</span>
                    <span className={`text-sm font-medium ${
                      portfolio.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {portfolio.totalGainLoss >= 0 ? '+' : ''}
                      ${Math.abs(portfolio.totalGainLoss).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Individual Portfolio Tab */}
        <TabsContent value="individual" className="space-y-6">
          <PortfolioSelector
            portfolios={portfolios}
            selectedPortfolio={selectedPortfolio}
            onPortfolioChange={setSelectedPortfolio}
            onCreatePortfolio={handleCreatePortfolio}
          />
          <PortfolioSection className="mt-6" />
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <PortfolioComparison portfolios={portfolios} />
        </TabsContent>
      </Tabs>
    </div>
  );
}