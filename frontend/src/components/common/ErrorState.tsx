"use client";

import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  variant?: 'default' | 'compact';
}

export default function ErrorState({ 
  title = "Something went wrong",
  message = "We encountered an unexpected error. Please try again.",
  onRetry,
  onGoHome,
  variant = 'default'
}: ErrorStateProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div className="text-sm">
            <p className="font-medium text-red-900">{title}</p>
            <p className="text-red-700">{message}</p>
          </div>
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="ml-2"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-6 p-8">
      <div className="relative">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
      </div>
      
      <div className="text-center space-y-3">
        <h3 className="text-xl font-semibold text-red-900">
          {title}
        </h3>
        <p className="text-sm text-red-700 max-w-sm">
          {message}
        </p>
      </div>

      <div className="flex space-x-3">
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        {onGoHome && (
          <Button onClick={onGoHome}>
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        )}
      </div>
    </div>
  );
}
