export type ConversationStageDto =
  | 'initial'
  | 'clarifying'
  | 'creating'
  | 'modifying';

export interface ConversationMessageDto {
  role: 'user' | 'assistant';
  content: string;
}

export interface ConversationContextDto {
  stage: ConversationStageDto;
  destination?: string;
  dates?: string;
  budget?: string;
  interests?: string[];
  travelers?: number;
}

export interface ActivityDto {
  time: string;
  name: string;
  description: string;
  address: string;
  type: string;
  coordinates: [number, number];
}

export interface DayDto {
  dayNumber: number;
  date: string;
  destination: string;
  activities: ActivityDto[];
}

export interface ItineraryDto {
  title: string;
  summary: string;
  days: DayDto[];
  accommodation: string;
  tips: string[];
  id?: string;
}

export interface ChatItineraryResponseDto {
  response: string;
  conversation: ConversationMessageDto[];
  context: ConversationContextDto;
  currentItinerary: ItineraryDto | undefined;
}
