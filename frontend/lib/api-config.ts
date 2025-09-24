/**
 * API Configuration for StockVision
 * Centralized configuration for all API endpoints and settings
 */

// Environment-based configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Backend API Configuration
export const API_CONFIG = {
  // Backend server URLs
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
  
  // API endpoints
  ENDPOINTS: {
    CHATBOT: {
      CHAT: '/api/chatbot/chat',
      SESSIONS: '/api/chatbot/sessions',
      MESSAGES: (sessionId: string) => `/api/chatbot/sessions/${sessionId}/messages`,
      DELETE_SESSION: (sessionId: string) => `/api/chatbot/sessions/${sessionId}`
    },
    STOCKS: {
      INFO: (symbol: string) => `/api/stocks/${symbol}`,
      PRICE: '/api/stocks/price',
      TRENDS: (symbol: string) => `/api/stocks/${symbol}/trends`
    },
    MARKET: {
      OVERVIEW: '/api/market/overview',
      TRENDS: '/api/market/trends',
      MOVERS: '/api/market/movers'
    },
    PORTFOLIOS: {
      OVERVIEW: '/api/portfolios/overview',
      CREATE: '/api/portfolios',
      UPDATE: (id: string) => `/api/portfolios/${id}`,
      DELETE: (id: string) => `/api/portfolios/${id}`
    }
  },
  
  // Request timeouts (in milliseconds)
  TIMEOUTS: {
    DEFAULT: 10000,
    CHATBOT: 30000,
    STOCK_DATA: 15000
  },
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY_MS: 1000
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BACKEND_URL}${endpoint}`;
};

// Helper function for making API calls with error handling
export const makeApiCall = async (
  endpoint: string,
  options: RequestInit = {},
  timeout: number = API_CONFIG.TIMEOUTS.DEFAULT
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(buildApiUrl(endpoint), {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Chat API helper functions
export const chatApi = {
  sendMessage: async (message: string, sessionId: string) => {
    const response = await makeApiCall(
      API_CONFIG.ENDPOINTS.CHATBOT.CHAT,
      {
        method: 'POST',
        body: JSON.stringify({
          message,
          session_id: sessionId
        }),
      },
      API_CONFIG.TIMEOUTS.CHATBOT
    );
    return response.json();
  },
  
  createSession: async () => {
    const response = await makeApiCall(
      API_CONFIG.ENDPOINTS.CHATBOT.SESSIONS,
      { method: 'POST' }
    );
    return response.json();
  },
  
  getMessages: async (sessionId: string) => {
    const response = await makeApiCall(
      API_CONFIG.ENDPOINTS.CHATBOT.MESSAGES(sessionId)
    );
    return response.json();
  }
};

export default API_CONFIG;