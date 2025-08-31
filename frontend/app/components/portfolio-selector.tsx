"use client";

import { useState } from "react";
import { Plus, Settings, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
}

interface PortfolioSelectorProps {
  portfolios: Portfolio[];
  selectedPortfolio: string;
  onPortfolioChange: (portfolioId: string) => void;
  onCreatePortfolio: (name: string, description?: string) => void;
  className?: string;
}

export function PortfolioSelector({
  portfolios,
  selectedPortfolio,
  onPortfolioChange,
  onCreatePortfolio,
  className
}: PortfolioSelectorProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [newPortfolioDescription, setNewPortfolioDescription] = useState("");

  const handleCreatePortfolio = () => {
    if (newPortfolioName.trim()) {
      onCreatePortfolio(newPortfolioName.trim(), newPortfolioDescription.trim() || undefined);
      setNewPortfolioName("");
      setNewPortfolioDescription("");
      setIsCreateDialogOpen(false);
    }
  };

  const selectedPortfolioData = portfolios.find(p => p.id === selectedPortfolio);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Portfolio</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Portfolio</DialogTitle>
                <DialogDescription>
                  Create a new portfolio to organize your investments.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Portfolio Name</Label>
                  <Input
                    id="name"
                    value={newPortfolioName}
                    onChange={(e) => setNewPortfolioName(e.target.value)}
                    placeholder="e.g., Long-Term Growth"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={newPortfolioDescription}
                    onChange={(e) => setNewPortfolioDescription(e.target.value)}
                    placeholder="Brief description of your investment strategy"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePortfolio} disabled={!newPortfolioName.trim()}>
                  Create Portfolio
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedPortfolio} onValueChange={onPortfolioChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a portfolio" />
          </SelectTrigger>
          <SelectContent>
            {portfolios.map((portfolio) => (
              <SelectItem key={portfolio.id} value={portfolio.id}>
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{portfolio.name}</span>
                  <Badge
                    variant={portfolio.dayChangePercent >= 0 ? "success" : "destructive"}
                    className="ml-2"
                  >
                    {portfolio.dayChangePercent >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(portfolio.dayChangePercent).toFixed(2)}%
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedPortfolioData && (
          <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Value</span>
              <span className="font-semibold">
                ${selectedPortfolioData.totalValue.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Daily Change</span>
              <div className="flex items-center gap-1">
                {selectedPortfolioData.dayChangePercent >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  selectedPortfolioData.dayChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${Math.abs(selectedPortfolioData.dayChange).toLocaleString()} 
                  ({Math.abs(selectedPortfolioData.dayChangePercent).toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Return</span>
              <div className="flex items-center gap-1">
                {selectedPortfolioData.totalGainLossPercent >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  selectedPortfolioData.totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${Math.abs(selectedPortfolioData.totalGainLoss).toLocaleString()} 
                  ({Math.abs(selectedPortfolioData.totalGainLossPercent).toFixed(2)}%)
                </span>
              </div>
            </div>
            {selectedPortfolioData.description && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  {selectedPortfolioData.description}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}