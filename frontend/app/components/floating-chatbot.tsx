'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Loader2, X, Minimize2, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatApi, API_CONFIG } from '../../lib/api-config';
import { useServerStatus, ApiErrorAlert } from '../../lib/error-handling';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
}

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI Stock Analyzer. Ask me about stock prices, trends, or market analysis!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Persist session ID for the lifetime of the browser tab to avoid losing conversation on remount
  const [sessionId] = useState(() => {
    // Guard for non-browser environments (e.g., tests) even though this is a client component
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return `session_${Date.now()}`;
    }
    let existing = sessionStorage.getItem('chat-session-id');
    if (!existing) {
      existing = `session_${Date.now()}`;
      try {
        sessionStorage.setItem('chat-session-id', existing);
      } catch (_e) {
        // Ignore storage failures (private mode / quota) and proceed with in-memory ID
      }
    }
    return existing;
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Use server status monitoring
  const { status: serverStatus, lastCheck, checkStatus } = useServerStatus();
  const isServerHealthy = serverStatus === 'connected';
  const isOnline = navigator?.onLine !== false;

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !isServerHealthy) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setApiError(null);

    try {
      // Check server status before attempting to send message
      if (!isServerHealthy) {
        await checkStatus();
        // Re-check status after the call
        if (!isServerHealthy) {
          throw new Error('Server is not accessible');
        }
      }

      const data = await chatApi.sendMessage(currentInput, sessionId);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        data: data.data
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      let errorContent = 'Sorry, I encountered an issue. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorContent = `Unable to connect to the StockVision server. Please check if the backend is running at ${API_CONFIG.BACKEND_URL}.`;
        } else if (error.message.includes('timeout')) {
          errorContent = 'Request timed out. The server might be busy. Please try again.';
        } else if (error.message.includes('Server is not accessible')) {
          errorContent = 'The StockVision server is currently offline. Please wait a moment and try again.';
        }
      }
      
      setApiError(errorContent);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "What's AAPL trading at?",
    "Show TSLA trends",
    "Market summary",
  ];

  // Floating Button
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
        {/* Floating indicator */}
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          AI
        </div>
      </div>
    );
  }

  // Chat Window
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={cn(
        "bg-white dark:bg-gray-900 rounded-lg shadow-2xl border transition-all duration-300",
        isMinimized ? "w-80 h-16" : "w-96 h-[500px]"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <span className="font-semibold">AI Stock Analyzer</span>
            {/* Dynamic connection status indicator */}
            {isServerHealthy ? (
              <div className="flex items-center gap-1">
                <Wifi className="h-3 w-3 text-green-300" />
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            ) : serverStatus === 'checking' ? (
              <div className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin text-yellow-300" />
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <WifiOff className="h-3 w-3 text-red-300" />
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:bg-blue-700 p-1 rounded"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 p-1 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* API Error Alert */}
            {apiError && (
              <ApiErrorAlert 
                error={new Error(apiError)} 
                onRetry={() => {
                  setApiError(null);
                  checkStatus();
                }} 
                onDismiss={() => setApiError(null)}
              />
            )}
            
            {/* Messages */}
            <div 
              ref={scrollRef} 
              className="flex-1 overflow-y-auto p-4 h-80 bg-gray-50 dark:bg-gray-800"
            >
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "flex gap-2 max-w-[80%]",
                        message.role === 'user' ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0",
                        message.role === 'user' 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                      )}>
                        {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      
                      <div className={cn(
                        "rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                        message.role === 'user'
                          ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-gray-700 border shadow-sm"
                      )}>
                        {message.content}
                        
                        {/* Stock Data Visualization */}
                        {message.data && Object.keys(message.data).length > 0 && (
                          <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-600 rounded border">
                            <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
                              📊 Stock Data
                            </div>
                            {Object.entries(message.data).map(([key, value]: [string, any]) => (
                              <div key={key} className="text-xs space-y-1">
                                {typeof value === 'object' && value !== null ? (
                                  <div>
                                    <div className="font-medium text-gray-700 dark:text-gray-300">{key.toUpperCase()}:</div>
                                    <div className="pl-2 space-y-1">
                                      {Object.entries(value).map(([subKey, subValue]: [string, any]) => (
                                        <div key={subKey} className="flex justify-between">
                                          <span className="text-gray-600 dark:text-gray-400 capitalize">
                                            {subKey.replace('_', ' ')}:
                                          </span>
                                          <span className="font-mono text-gray-800 dark:text-gray-200">
                                            {typeof subValue === 'number' ? (
                                              subKey.includes('price') || subKey.includes('cost') ? 
                                                `$${subValue.toFixed(2)}` :
                                              subKey.includes('percent') ?
                                                `${subValue.toFixed(2)}%` :
                                                subValue.toLocaleString()
                                            ) : (
                                              String(subValue)
                                            )}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400 capitalize">
                                      {key.replace('_', ' ')}:
                                    </span>
                                    <span className="font-mono text-gray-800 dark:text-gray-200">{String(value)}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-sm border shadow-sm">
                      Analyzing your request...
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Questions */}
            <div className="px-4 py-2 border-t bg-gray-50 dark:bg-gray-800">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick questions:</div>
              <div className="flex flex-wrap gap-1">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 text-xs px-2 py-1 rounded transition-colors"
                    disabled={isLoading}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Input */}
            <div className="p-4 border-t bg-white dark:bg-gray-900 rounded-b-lg">
              {/* Server status message when disconnected */}
              {!isServerHealthy && (
                <div className="mb-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {serverStatus === 'checking' 
                    ? 'Checking connection...' 
                    : 'Server offline - Chat disabled'}
                </div>
              )}
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    !isServerHealthy 
                      ? "Waiting for server connection..." 
                      : "Ask about stocks, trends, or analysis..."
                  }
                  disabled={isLoading || !isServerHealthy}
                  className={cn(
                    "flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm",
                    !isServerHealthy && "opacity-50 cursor-not-allowed"
                  )}
                />
                <button 
                  onClick={sendMessage} 
                  disabled={!input.trim() || isLoading || !isServerHealthy}
                  className={cn(
                    "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-md transition-colors",
                    !isServerHealthy && "cursor-not-allowed"
                  )}
                  title={
                    !isServerHealthy 
                      ? "Server is offline" 
                      : isLoading 
                        ? "Sending..." 
                        : "Send message"
                  }
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
