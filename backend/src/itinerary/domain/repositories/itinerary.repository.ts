import { Itinerary } from '../entities/itinerary.entity';
import { Conversation } from '../entities/conversation.entity';
import { TravelPlanningSession } from '../aggregates/travel-planning-session.aggregate';
import { ItineraryVisibilityEnum } from '@shared/types/itinerary/chat-itinerary.response.dto';

export abstract class ItineraryRepository {
  abstract create(
    sessionId: string,
    userId: string,
    itineraryWithConversation: {
      itinerary: Itinerary;
      conversation: Conversation;
    },
  ): Promise<void>;
  abstract getTravelPlanningSession(
    sessionId: string,
  ): Promise<TravelPlanningSession | null>;
  abstract updateTravelPlanningSession(
    sessionId: string,
    session: TravelPlanningSession,
  ): Promise<void>;
  abstract updateVisibility(
    id: string,
    visibility: ItineraryVisibilityEnum,
  ): Promise<Itinerary | null>;
  abstract findById(id: string): Promise<Itinerary | null>;
  abstract getMyItineraries(userId: string): Promise<Itinerary[]>;
  abstract getPublicItineraries(): Promise<Itinerary[]>;
  abstract getPublicItineraryBySlug(slug: string): Promise<Itinerary | null>;
}
