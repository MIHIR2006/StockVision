"use client";

import { useState, useEffect } from 'react';
import { portfolioAPI, Portfolio, CreatePortfolioRequest } from '@/lib/portfolio-api';
import { mockPortfolios } from '@/data/mock-data';

// Transform API portfolio to frontend portfolio format
const transformPortfolio = (apiPortfolio: any) => ({
  id: apiPortfolio.id,
  name: apiPortfolio.name,
  description: apiPortfolio.description,
  totalValue: apiPortfolio.total_value,
  totalCost: apiPortfolio.total_cost,
  dayChange: apiPortfolio.day_change,
  dayChangePercent: apiPortfolio.day_change_percent,
  totalGainLoss: apiPortfolio.total_gain_loss,
  totalGainLossPercent: apiPortfolio.total_gain_loss_percent,
  stocks: apiPortfolio.stocks || [],
  createdAt: apiPortfolio.created_at,
  updatedAt: apiPortfolio.updated_at,
});

export function usePortfolios() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API, fallback to mock data
      try {
        const apiPortfolios = await portfolioAPI.getPortfolios();
        const transformedPortfolios = apiPortfolios.map(transformPortfolio);
        setPortfolios(transformedPortfolios);
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
        // Use mock data as fallback
        setPortfolios(mockPortfolios);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolios');
      // Fallback to mock data on error
      setPortfolios(mockPortfolios);
    } finally {
      setLoading(false);
    }
  };

  const createPortfolio = async (data: CreatePortfolioRequest) => {
    try {
      setError(null);
      
      try {
        const newPortfolio = await portfolioAPI.createPortfolio(data);
        const transformedPortfolio = transformPortfolio(newPortfolio);
        setPortfolios(prev => [...prev, transformedPortfolio]);
        return transformedPortfolio;
      } catch (apiError) {
        // Fallback: create mock portfolio
        const mockPortfolio = {
          id: Date.now().toString(),
          name: data.name,
          description: data.description,
          totalValue: 0,
          totalCost: 0,
          dayChange: 0,
          dayChangePercent: 0,
          totalGainLoss: 0,
          totalGainLossPercent: 0,
          stocks: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setPortfolios(prev => [...prev, mockPortfolio]);
        return mockPortfolio;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create portfolio');
      throw err;
    }
  };

  const updatePortfolio = async (portfolioId: string, data: Partial<CreatePortfolioRequest>) => {
    try {
      setError(null);
      
      try {
        const updatedPortfolio = await portfolioAPI.updatePortfolio(portfolioId, data);
        const transformedPortfolio = transformPortfolio(updatedPortfolio);
        setPortfolios(prev => 
          prev.map(p => p.id === portfolioId ? transformedPortfolio : p)
        );
        return transformedPortfolio;
      } catch (apiError) {
        // Fallback: update mock portfolio
        setPortfolios(prev => 
          prev.map(p => 
            p.id === portfolioId 
              ? { ...p, ...data, updatedAt: new Date().toISOString() }
              : p
          )
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update portfolio');
      throw err;
    }
  };

  const deletePortfolio = async (portfolioId: string) => {
    try {
      setError(null);
      
      try {
        await portfolioAPI.deletePortfolio(portfolioId);
      } catch (apiError) {
        console.warn('API delete failed, removing from local state:', apiError);
      }
      
      setPortfolios(prev => prev.filter(p => p.id !== portfolioId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete portfolio');
      throw err;
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  return {
    portfolios,
    loading,
    error,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    refetch: fetchPortfolios,
  };
}