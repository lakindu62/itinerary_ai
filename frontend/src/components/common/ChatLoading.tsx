"use client";

import { Loader2, MessageCircle, MapPin, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import TripDesignLoading from "./TripDesignLoading";

interface ChatLoadingProps {
  type?: 'session' | 'message' | 'initial' | 'trip-design';
  text?: string;
}

export default function ChatLoading({ type = 'session', text }: ChatLoadingProps) {
  if (type === 'trip-design') {
    return <TripDesignLoading />;
  }

  if (type === 'message') {
    return (
      <div className="flex items-center space-x-3 p-4 bg-muted/30 rounded-lg">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
      </div>
    );
  }

  if (type === 'initial') {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-6 p-8">
        <div className="relative">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {text || "Starting your travel conversation..."}
          </h3>
          <p className="text-sm text-muted-foreground">
            Our AI assistant is getting ready to help you plan your perfect trip
          </p>
        </div>

        <div className="flex space-x-2">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>Planning destinations</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Scheduling activities</span>
          </div>
        </div>
      </div>
    );
  }

  // Default session loading
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-6 p-8">
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
          <MessageCircle className="w-10 h-10 text-primary" />
        </div>
        <div className="absolute -top-2 -right-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
      
      <div className="text-center space-y-3">
        <h3 className="text-xl font-semibold text-foreground">
          {text || "Loading your travel session..."}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Fetching your conversation history and preparing your personalized travel assistant
        </p>
      </div>

      <div className="w-full max-w-xs space-y-3">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-3 w-full" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      </div>
    </div>
  );
}
