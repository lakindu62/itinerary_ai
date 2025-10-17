import { Injectable, Logger } from '@nestjs/common';
import { TravelPlanningSession } from 'src/itinerary/domain/aggregates/travel-planning-session.aggregate';
import {
  UpdateContextUseCase,
  HandleClarificationUseCase,
  CreateItineraryUseCase,
  ModifyItineraryUseCase,
} from '../use-cases/itinerary-generation';
import { ItineraryRepository } from 'src/itinerary/domain/repositories/itinerary.repository';
import { ChatItineraryResponseDto } from '@shared/types/itinerary/chat-itinerary.response.dto';
import { mapItineraryToDto } from '../mappers/itinerary-dto.mapper';

@Injectable()
export class ItineraryChatService {
  private readonly logger = new Logger(ItineraryChatService.name);

  // In-memory session storage using Map
  private readonly sessions: Map<string, TravelPlanningSession> = new Map();

  constructor(
    private readonly updateContextUseCase: UpdateContextUseCase,
    private readonly handleClarificationUseCase: HandleClarificationUseCase,
    private readonly createItineraryUseCase: CreateItineraryUseCase,
    private readonly modifyItineraryUseCase: ModifyItineraryUseCase,
    private readonly itineraryRepository: ItineraryRepository,
  ) {}

  async getChatItinerary(
    sessionId: string,
  ): Promise<ChatItineraryResponseDto | null> {
    // First check in-memory cache
    let session: TravelPlanningSession | null | undefined =
      this.sessions.get(sessionId);

    // If not in memory, try to load from DB
    if (!session) {
      session =
        await this.itineraryRepository.getTravelPlanningSession(sessionId);
      if (session) {
        // Cache it in memory for future requests
        this.sessions.set(sessionId, session);
      }
    }

    if (!session) {
      return null;
    }

    return {
      response:
        session.getConversation().messages[
          session.getConversation().messages.length - 1
        ].content,
      conversation: session.getConversation(),
      currentItinerary: session.getCurrentItinerary()
        ? mapItineraryToDto(session.getCurrentItinerary()!)
        : undefined,
    };
  }

  async chatItinerary(
    userId: string,
    message: string,
    sessionId: string,
  ): Promise<ChatItineraryResponseDto> {
    this.logger.log(`Received message: ${message}, sessionId: ${sessionId}`);

    // Get session from memory first, then DB, or create new
    let session: TravelPlanningSession | null | undefined =
      this.sessions.get(sessionId);
    if (!session) {
      session =
        await this.itineraryRepository.getTravelPlanningSession(sessionId);
    }
    if (!session) {
      session = new TravelPlanningSession(sessionId);
    }

    // Store session in memory immediately
    this.sessions.set(sessionId, session);

    session.addUserMessage(message);
    await this.updateContextUseCase.execute(message, session);

    let response: string = '';

    // Now the business logic is cleaner and more expressive
    if (session.needsClarification()) {
      response = await this.handleClarification(message, session);
    } else if (session.isReadyForItineraryCreation()) {
      response = await this.createItinerary(userId, session, sessionId);
    } else if (session.canModifyItinerary()) {
      response = await this.modifyItinerary(message, session, sessionId);
    }

    session.addAssistantMessage(response);

    // Update in-memory session
    this.sessions.set(sessionId, session);

    this.logger.log(
      `Sending response: ${JSON.stringify({
        response,
        conversation: session.getConversation(),
        currentItinerary: session.getCurrentItinerary(),
      })}`,
    );

    return {
      response,
      conversation: session.getConversation(),
      currentItinerary: session.getCurrentItinerary()
        ? mapItineraryToDto(session.getCurrentItinerary()!)
        : undefined,
    };
  }

  private async handleClarification(
    message: string,
    session: TravelPlanningSession,
  ): Promise<string> {
    const context = session.getContext();

    if (!context.destination) {
      return "I'd love to help you plan your trip! Where would you like to travel?";
    }

    return this.handleClarificationUseCase.execute(context);
  }

  private async createItinerary(
    userId: string,
    session: TravelPlanningSession,
    sessionId: string,
  ): Promise<string> {
    const createResult = await this.createItineraryUseCase.execute(
      session.getContext(),
    );

    // Use aggregate method instead of manual context updates
    session.createItinerary(
      createResult.itinerary.title,
      createResult.itinerary.summary,
      createResult.itinerary.days,
      createResult.itinerary.accommodation,
      createResult.itinerary.tips,
    );

    this.logger.log(`Created itinerary -> _id: ${createResult.itinerary.id}`);

    // Now save to DB since itinerary is complete
    await this.itineraryRepository.create(
      sessionId,
      userId,
      session.getItineraryWithConversation(),
    );

    this.logger.log(
      `Itinerary with _id: ${createResult.itinerary.id} saved in DB for user ${userId}`,
    );

    return createResult.response;
  }

  private async modifyItinerary(
    message: string,
    session: TravelPlanningSession,
    sessionId: string,
  ): Promise<string> {
    const currentItinerary = session.getCurrentItinerary()!;

    const modifyResult = await this.modifyItineraryUseCase.execute(
      message,
      currentItinerary,
      session.getContext(),
    );

    // Use aggregate method
    session.modifyItinerary(
      modifyResult.itinerary.title,
      modifyResult.itinerary.summary,
      modifyResult.itinerary.days,
      modifyResult.itinerary.accommodation,
      modifyResult.itinerary.tips,
    );

    // Update DB with modified itinerary
    await this.itineraryRepository.updateTravelPlanningSession(
      sessionId,
      session,
    );

    return modifyResult.response;
  }

  /**
   * Optional: Method to clear old sessions from memory to prevent memory leaks
   * Call this periodically or when needed
   */
  clearInactiveSessionsOlderThan(hours: number = 24): void {
    // This is a simple implementation - you might want to track lastAccessTime
    // For now, you can manually clear sessions or implement a more sophisticated approach
    this.logger.log(`Session cache size: ${this.sessions.size}`);
  }

  /**
   * Optional: Method to manually remove a session from cache
   */
  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
    this.logger.log(`Cleared session ${sessionId} from cache`);
  }
}
