'use client'
import React, { useState, useEffect, useRef } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@frontend/components/ui/resizable';
import ChatInterface from './ChatInterface';
import MapComponent from './MapComponent';
import ItineraryDisplay from './ItineraryDisplay';
import ChatLoading from '@/components/common/ChatLoading';
import ErrorState from '@/components/common/ErrorState';

import { ActivityDto, ChatItineraryResponseDto, ConversationMessageDto } from '@shared/types/itinerary/chat-itinerary.response.dto'
import { useGetChatItineraryQuery, useChatItineraryMutation } from '../api/itinerary.api';

// Helper interface for map display
export interface Place {
  id: string;
  name: string;
  type: string;
  coordinates: [number, number];
  description: string;
  rating?: number;
  address?: string;
  time?: string;
  estimatedCost?: number;
  duration?: number;
}

const TravelChatbot = ({ id, initialQuery }: { id: string, initialQuery: string }) => {
  const [selectedPlace, setSelectedPlace] = useState<ActivityDto | null>(null);
  const [messages, setMessages] = useState<ConversationMessageDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<ChatItineraryResponseDto>();
  const [isInitializing, setIsInitializing] = useState(false);
  const hasInitialized = useRef(false)
  // All API queries centralized in parent
  const { data: sessionGot, isLoading: sessionLoading, isFetching } = useGetChatItineraryQuery(id);
  const [chatItinerary, { isLoading: creatingItinerayLoading }] = useChatItineraryMutation();

  // Initialize session - runs once when component mounts or when sessionGot changes
  useEffect(() => {
    async function sendInitialPrompt() {
      console.log("🚀 ~ TravelChatbot ~ initialQuery - useEffect -sendInitialPrompt:", initialQuery)
      setIsInitializing(true);
      try {
        const res = await chatItinerary({
          message: initialQuery,
          conversationId: id || ''
        }).unwrap()
        setSession(res)
        hasInitialized.current = true;
      } catch (error) {
        console.error("Failed to send initial prompt:", error);
      } finally {
        setIsInitializing(false);
      }
    }

    // CRITICAL: Wait for BOTH loading and fetching to complete
    // This ensures we've actually checked the DB/memory before deciding
    if (sessionLoading || isFetching) {
      console.log("⏳ Waiting for session query to complete...");
      return;
    }

    // Prevent running if already initialized
    if (hasInitialized.current) {
      console.log("✅ Already initialized, skipping");
      return;
    }

    // At this point, the query has definitely completed
    if (sessionGot) {
      // Session exists in DB/memory, use it
      console.log("📦 Loading existing session from DB/memory");
      setSession(sessionGot);
      hasInitialized.current = true;
    } else {
      // Query completed but returned null/undefined - no session exists
      console.log("🆕 No existing session, creating new session with initial prompt");
      sendInitialPrompt();
    }
  }, [sessionGot, sessionLoading, isFetching, initialQuery, chatItinerary, id])

  // Initialize messages from session data
  useEffect(() => {
    if (session?.conversation?.messages) {
      setMessages(session.conversation.messages);
    }
  }, [session]);

  console.log("🚀 ~ TravelChatbot ~ session:", session)

  // Show initializing state when sending the first prompt
  if (isInitializing) {
    return (
      <div className="h-screen overflow-hidden bg-background">
        <div className="h-[calc(100vh-80px)] border">
          <ChatLoading
            type="initial"
            text="Starting your travel conversation..."
          />
        </div>
      </div>
    );
  }

  if (sessionLoading) {
    return (
      <div className="h-screen overflow-hidden bg-background">
        <div className="h-[calc(100vh-80px)] border">
          <ChatLoading
            type="session"
            text="Loading your travel session..."
          />
        </div>
      </div>
    );
  }

  if (!session && !sessionLoading) {
    return (
      <div className="h-screen overflow-hidden bg-background">
        <div className="h-[calc(100vh-80px)] border">
          <ErrorState
            title="Session Not Found"
            message="We couldn't find your travel session. This might be a new conversation or the session may have expired."
            onGoHome={() => window.location.href = '/'}
          />
        </div>
      </div>
    );
  }

  // Handle chat messages from parent
  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: ConversationMessageDto = {
      role: 'user',
      content: message.trim(),
    };

    // Optimistically add user message
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatItinerary({
        message: userMessage.content,
        conversationId: id
      });

      if (!response.data) {
        throw new Error('Failed to get response from server');
      }

      // Update session with new response
      setSession(response.data);
    } catch (error) {
      console.error('Failed to send message:', error);

      // Remove optimistic message and add error message
      setMessages(prev => {
        const withoutLast = prev.slice(0, -1);
        return [...withoutLast, {
          role: 'assistant',
          content: "I apologize, but I couldn't process your request right now. Please try again or be more specific about your destination and preferences.",
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-card">
      <div className="h-[calc(100vh)] rounded-[30px] ">
        <ResizablePanelGroup className='border rounded-[30px] pt-20' direction="horizontal">
          <ResizablePanel defaultSize={session?.currentItinerary ? 33 : 50} minSize={25}>
            <div className="h-full flex flex-col">
              <ChatInterface
                messages={messages}
                isLoading={isLoading}
                context={session?.conversation?.context || { stage: 'initial' }}
                onSendMessage={handleSendMessage}
                initialQuery={initialQuery}
                conversationId={id}
              />
            </div>
          </ResizablePanel>
          {session?.conversation.context.stage != 'modifying' && <ResizablePanel className='defaultSize={66}'>
            <ChatLoading
              type="trip-design"
            />
          </ResizablePanel>}
          {session?.conversation.context.stage === 'modifying' && (
            <>
              <ResizableHandle className='border-none bg-card-background' />
              <ResizablePanel defaultSize={33} minSize={25}>
                <div className="flex-1  h-full" style={{ minHeight: '300px' }}>
                  <ItineraryDisplay
                    itinerary={session.currentItinerary}
                    context={session.conversation?.context || { stage: 'initial' }}
                    onPlaceSelect={setSelectedPlace}
                    selectedPlace={selectedPlace}
                  />
                </div>
              </ResizablePanel>
            </>
          )}
          {session?.conversation.context.stage === 'modifying' && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={session.currentItinerary ? 34 : 50} minSize={25}>
                <MapComponent
                  itinerary={session.currentItinerary}
                  selectedPlace={selectedPlace}
                  onPlaceSelect={setSelectedPlace}
                />
              </ResizablePanel>
            </>)}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default TravelChatbot;