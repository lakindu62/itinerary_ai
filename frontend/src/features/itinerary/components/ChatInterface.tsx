import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Loader2, Send, MapPin, Clock, Users } from 'lucide-react';
import { Itinerary } from './TravelChatbot';
import { generateItinerary } from '../lib/itineraryGenerator';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onItineraryGenerated: (itinerary: Itinerary) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onItineraryGenerated }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI travel assistant. Tell me about your dream trip and I'll create a personalized itinerary for you. Where would you like to go?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const itinerary = await generateItinerary(userMessage.content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Perfect! I've created a ${itinerary.duration}-day itinerary for ${itinerary.destination}. You'll visit ${itinerary.totalPlaces} amazing places. Check out the map and itinerary details on the right!`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      onItineraryGenerated(itinerary);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I apologize, but I couldn't generate your itinerary right now. Please try again or be more specific about your destination and preferences.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    { icon: MapPin, text: "3-day Paris adventure", color: "text-primary" },
    { icon: Clock, text: "Weekend in Tokyo", color: "text-travel-green" },
    { icon: Users, text: "Family trip to London", color: "text-accent" }
  ];

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b bg-muted/20">
        <h2 className="font-semibold text-card-foreground">Chat with AI Assistant</h2>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card className={`max-w-[80%] p-3 ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground ml-4' 
                  : 'bg-muted mr-4'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 opacity-70 ${
                  message.type === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </Card>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <Card className="bg-muted p-3 mr-4">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p className="text-sm">Planning your perfect trip...</p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {messages.length === 1 && (
        <div className="p-4 border-t bg-muted/10">
          <p className="text-sm text-muted-foreground mb-3">Quick suggestions:</p>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full justify-start h-auto py-2"
                onClick={() => setInputValue(suggestion.text)}
              >
                <suggestion.icon className={`w-4 h-4 mr-2 ${suggestion.color}`} />
                {suggestion.text}
              </Button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="p-4 border-t bg-background">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tell me about your ideal trip..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !inputValue.trim()}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;