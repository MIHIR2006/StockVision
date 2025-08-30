// Portfolio API service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  total_value: number;
  total_cost: number;
  day_change: number;
  day_change_percent: number;
  total_gain_loss: number;
  total_gain_loss_percent: number;
  stocks: any[];
  created_at: string;
  updated_at: string;
}

export interface PortfolioHistory {
  portfolio_id: string;
  date: string;
  value: number;
  change: number;
  change_percent: number;
}

export interface CreatePortfolioRequest {
  name: string;
  description?: string;
}

export interface PortfolioComparison {
  portfolios: string[];
  time_range?: string;
  metrics?: string[];
}

class PortfolioAPI {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getPortfolios(): Promise<Portfolio[]> {
    return this.request<Portfolio[]>('/api/portfolios/');
  }

  async getPortfolio(portfolioId: string): Promise<Portfolio> {
    return this.request<Portfolio>(`/api/portfolios/${portfolioId}`);
  }

  async createPortfolio(data: CreatePortfolioRequest): Promise<Portfolio> {
    return this.request<Portfolio>('/api/portfolios/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePortfolio(portfolioId: string, data: Partial<CreatePortfolioRequest>): Promise<Portfolio> {
    return this.request<Portfolio>(`/api/portfolios/${portfolioId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePortfolio(portfolioId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/portfolios/${portfolioId}`, {
      method: 'DELETE',
    });
  }

  async getPortfolioHistory(portfolioId: string, days: number = 90): Promise<PortfolioHistory[]> {
    return this.request<PortfolioHistory[]>(`/api/portfolios/${portfolioId}/history?days=${days}`);
  }

  async comparePortfolios(comparison: PortfolioComparison): Promise<any> {
    return this.request<any>('/api/portfolios/compare', {
      method: 'POST',
      body: JSON.stringify(comparison),
    });
  }

  async getPortfolioAnalytics(): Promise<any> {
    return this.request<any>('/api/portfolios/analytics/summary');
  }
}

export const portfolioAPI = new PortfolioAPI();