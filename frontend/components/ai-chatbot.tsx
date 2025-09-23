'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../app/components/ui/card';
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { ScrollArea } from '../app/components/ui/scroll-area';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '../app/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
}

interface StockChatbotProps {
  className?: string;
}

export function StockChatbot({ className }: StockChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Stock Analyzer. I can help you with:\n\n• Real-time stock prices and trends\n• Portfolio analysis and comparisons\n• Risk assessment and growth analysis\n• Market insights and recommendations\n\nWhat would you like to analyze today? Try asking:\n- "What\'s the current price of AAPL?"\n- "Show me trends for TSLA"\n- "Give me a market summary"',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

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

    try {
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          session_id: sessionId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

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
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please ensure the backend is running and try again.',
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
    "What's the price of AAPL?",
    "Show me TSLA trends",
    "Market summary today",
    "Compare GOOGL vs MSFT"
  ];

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <Card className={cn("h-[600px] flex flex-col", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Stock Analyzer
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea ref={scrollRef} className="flex-1 px-4">
          <div className="space-y-4 py-4">
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
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  
                  <div className={cn(
                    "rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                    message.role === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}>
                    {message.content}
                    
                    {/* Render data visualizations if available */}
                    {message.data && Object.keys(message.data).length > 0 && (
                      <div className="mt-3 p-3 bg-background/20 rounded border">
                        <StockDataVisualization data={message.data} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                  Analyzing your request...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Quick Questions */}
        <div className="px-4 py-2 border-t bg-muted/20">
          <div className="text-xs text-muted-foreground mb-2">Quick questions:</div>
          <div className="flex flex-wrap gap-1">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-6 text-xs px-2"
                onClick={() => handleQuickQuestion(question)}
                disabled={isLoading}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about stocks, portfolios, or market trends..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Component to visualize stock data in chat
function StockDataVisualization({ data }: { data: any }) {
  if (!data || typeof data !== 'object') return null;

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Stock Data
      </div>
      
      {Object.entries(data).map(([key, value]: [string, any]) => (
        <div key={key} className="space-y-1">
          {typeof value === 'object' && value !== null ? (
            <div className="space-y-1">
              <div className="text-xs font-medium">{key.toUpperCase()}:</div>
              <div className="pl-2 space-y-1">
                {Object.entries(value).map(([subKey, subValue]: [string, any]) => (
                  <div key={subKey} className="flex justify-between text-xs">
                    <span className="text-muted-foreground capitalize">
                      {subKey.replace('_', ' ')}:
                    </span>
                    <span className="font-mono">
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
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground capitalize">
                {key.replace('_', ' ')}:
              </span>
              <span className="font-mono">{String(value)}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}