/**
 * Error Boundary and Recovery Components for StockVision
 * Provides robust error handling and user feedback
 */

'use client';

import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { API_CONFIG } from './api-config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Error Boundary Props
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

// Main Error Boundary Component
export class StockVisionErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('StockVision Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="w-full max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Something went wrong
            </CardTitle>
            <CardDescription>
              An unexpected error occurred. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={this.handleRetry} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-xs">
                <summary className="cursor-pointer">Error Details</summary>
                <pre className="mt-2 whitespace-pre-wrap break-all">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Connection Status Component
interface ConnectionStatusProps {
  isOnline?: boolean;
  backendStatus?: 'connected' | 'disconnected' | 'checking';
}

export function ConnectionStatus({ isOnline = true, backendStatus = 'checking' }: ConnectionStatusProps) {
  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-500';
    if (backendStatus === 'connected') return 'bg-green-500';
    if (backendStatus === 'disconnected') return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (backendStatus === 'connected') return 'Connected';
    if (backendStatus === 'disconnected') return 'Backend Unavailable';
    return 'Connecting...';
  };

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
      <span>{getStatusText()}</span>
    </div>
  );
}

// API Error Handler Component
interface ApiErrorAlertProps {
  error: Error | null;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ApiErrorAlert({ error, onRetry, onDismiss }: ApiErrorAlertProps) {
  if (!error) return null;

  const getErrorMessage = (error: Error) => {
    if (error.message.includes('fetch')) {
      return 'Unable to connect to server. Please check your internet connection and try again.';
    }
    if (error.message.includes('timeout')) {
      return 'Request timed out. The server might be busy, please try again.';
    }
    if (error.message.includes('404')) {
      return 'Service not found. Please contact support if this continues.';
    }
    if (error.message.includes('500')) {
      return 'Server error occurred. Please try again later.';
    }
    return 'An unexpected error occurred. Please try again.';
  };

  return (
    <Alert className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="flex items-center justify-between">
          <span>{getErrorMessage(error)}</span>
          <div className="flex gap-2 ml-4">
            {onRetry && (
              <Button size="sm" variant="outline" onClick={onRetry}>
                Retry
              </Button>
            )}
            {onDismiss && (
              <Button size="sm" variant="ghost" onClick={onDismiss}>
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Loading State Component
interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Loading...', className = '' }: LoadingStateProps) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <span className="text-muted-foreground">{message}</span>
      </div>
    </div>
  );
}

// Server Status Checker Hook
export function useServerStatus() {
  const [status, setStatus] = React.useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [lastCheck, setLastCheck] = React.useState<Date>(new Date());

  const checkStatus = React.useCallback(async () => {
    try {
      setStatus('checking');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_CONFIG.BACKEND_URL}/`, { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      setStatus(response.ok ? 'connected' : 'disconnected');
    } catch (error) {
      setStatus('disconnected');
    } finally {
      setLastCheck(new Date());
    }
  }, []);

  React.useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [checkStatus]);

  return { status, lastCheck, checkStatus };
}