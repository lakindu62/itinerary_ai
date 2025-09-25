'use client'
import React, { useState, useEffect } from "react";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-sm">AI</span>
          </div>
          <p className="text-muted-foreground">Loading Travel Planner...</p>
        </div>
      </div>
    );
  }

  return (
    <React.Suspense fallback={
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-sm">AI</span>
          </div>
          <p className="text-muted-foreground">Loading Travel Planner...</p>
        </div>
      </div>
    }>
      {React.createElement(
        React.lazy(() => import("@frontend/features/itinerary/components/TravelChatbot"))
      )}
    </React.Suspense>
  );
}
