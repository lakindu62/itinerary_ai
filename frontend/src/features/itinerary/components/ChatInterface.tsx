'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Loader2, Send, MapPin, Clock, Users, DollarSign } from 'lucide-react';
import { ConversationContextDto, ConversationMessageDto } from '@shared/types/itinerary/chat-itinerary.response.dto';

interface ChatInterfaceProps {
  messages: ConversationMessageDto[];
  isLoading: boolean;
  context: ConversationContextDto;
  onSendMessage: (message: string) => void;
  initialQuery?: string;
  conversationId?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  context,
  onSendMessage,
  initialQuery,
  conversationId
}) => {
  const [inputValue, setInputValue] = useState('');
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

    const message = inputValue.trim();
    setInputValue('');
    onSendMessage(message);
  };

  const getStageDisplay = (stage: ConversationContextDto['stage']) => {
    const stages = {
      initial: 'Getting Started',
      clarifying: 'Gathering Details',
      creating: 'Creating Your Itinerary',
      modifying: 'Refining Your Plan',
      completed: 'Ready to Travel!'
    };
    return stages[stage];
  };


  const suggestions = [
    {
      icon: MapPin,
      text: "3-day Kandy adventure for 2 people in July (adventure)",
      color: "text-primary"
    },
    {
      icon: Clock,
      text: "Weekend in Kandy for 1 traveler in September (food & culture)",
      color: "text-travel-green"
    },
    {
      icon: Users,
      text: "Family trip to Kandy for 4 in December (sightseeing)",
      color: "text-accent"
    }
  ];

  return (
    <div className="h-full flex flex-col bg-card rounded-l-[30px] border">
      <div className="p-4 border-b bg-muted/20 rounded-[30px]">
        <div className="flex justify-between items-center rounded-[30px]">
          <h2 className="font-semibold text-card-foreground rounded-[30px]">Chat with AI Assistant</h2>
          <span className="text-xs text-muted-foreground px-2 py-1 bg-primary/10 rounded-full">
            {getStageDisplay(context.stage)}
          </span>
        </div>

        {/* Context Summary */}
        {(context.destination || context.dates || context.travelers || context.budget) && (
          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex flex-wrap gap-3 text-xs">
              {context.destination && (
                <div className="flex items-center space-x-1">
                  <MapPin size={12} className="text-primary" />
                  <span>{context.destination}</span>
                </div>
              )}
              {context.travelers && (
                <div className="flex items-center space-x-1">
                  <Users size={12} className="text-purple-500" />
                </div>
              )}
              {context.budget && (
                <div className="flex items-center space-x-1">
                  <DollarSign size={12} className="text-yellow-500" />
                  <span>context.budget</span>
                </div>
              )}
            </div>
            {context.interests && context.interests.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {context.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-4 h-[200px]" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card className={`max-w-[80%] p-3 ${message.role === 'user'
                ? 'bg-primary text-primary-foreground ml-4'
                : 'bg-muted mr-4'
                }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 opacity-70 ${message.role === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`}>
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

      {messages.length <= 1 && !context.destination && (
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