'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@clerk/nextjs';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import SliderManager from './SliderManager';
import PostManager from './PostManager';
import VideoManager from './VideoManager';
import MenuManager from './MenuManager';
import Analytics from './Analytics';
import ReviewsManager from './ReviewsManager';
import CommentsManager from './CommentsManager';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.message || 'Something went wrong. Please try again later.'}
      </AlertDescription>
    </Alert>
  );
}

export default function BusinessDashboardOverview() {
  const { getToken } = useAuth();
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Business Dashboard</h1>
      
      <Tabs defaultValue="sliders" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="sliders">Sliders</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="menu">Menu Items</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sliders">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <SliderManager />
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="posts">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <PostManager />
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="videos">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <VideoManager />
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="menu">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <MenuManager />
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="reviews">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <ReviewsManager />
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="comments">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <CommentsManager />
          </ErrorBoundary>
        </TabsContent>
        
        <TabsContent value="analytics">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Analytics />
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
}