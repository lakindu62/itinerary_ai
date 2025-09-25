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

@Injectable()
export class ItineraryChatService {
  private sessions = new Map<string, TravelPlanningSession>();
  private readonly logger = new Logger(ItineraryChatService.name);
  constructor(
    private readonly updateContextUseCase: UpdateContextUseCase,
    private readonly handleClarificationUseCase: HandleClarificationUseCase,
    private readonly createItineraryUseCase: CreateItineraryUseCase,
    private readonly modifyItineraryUseCase: ModifyItineraryUseCase,
    private readonly itineraryRepository: ItineraryRepository,
  ) {}

  async chatItinerary(
    message: string,
    sessionId: string,
  ): Promise<ChatItineraryResponseDto> {
    this.logger.log(`Received message: ${message}, sessionId: ${sessionId}`);
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = new TravelPlanningSession(sessionId);
    }

    session.addUserMessage(message);
    console.log(message);

    await this.updateContextUseCase.execute(message, session);
    console.log(session.getContext());

    let response: string = '';

    // Now the business logic is cleaner and more expressive
    if (session.needsClarification()) {
      response = this.handleClarification(message, session);
    } else if (session.isReadyForItineraryCreation()) {
      response = await this.createItinerary(session);
    } else if (session.canModifyItinerary()) {
      response = await this.modifyItinerary(message, session);
    }

    session.addAssistantMessage(response);
    console.log(
      '🚀 ~ ItineraryChatService ~ chatItinerary ~ session.getContext():',
      session.getContext(),
    );
    this.sessions.set(sessionId, session);

    return {
      response,
      conversation: session.getConversationMessages(),
      context: session.getContext(),
      currentItinerary: session.getCurrentItinerary(),
    };
  }

  private handleClarification(
    message: string,
    session: TravelPlanningSession,
  ): string {
    const context = session.getContext();

    if (!context.destination) {
      return "I'd love to help you plan your trip! Where would you like to travel?";
    }

    return this.handleClarificationUseCase.execute(context);
  }

  private async createItinerary(
    session: TravelPlanningSession,
  ): Promise<string> {
    const createResult = await this.createItineraryUseCase.execute(
      session.getContext(),
    );

    console.log(createResult);

    // Use aggregate method instead of manual context updates
    session.createItinerary(
      createResult.itinerary.title,
      createResult.itinerary.summary,
      createResult.itinerary.days,
      createResult.itinerary.accommodation,
      createResult.itinerary.tips,
    );
    console.log(
      '🚀 ~ ItineraryChatService ~ createItinerary ~ session:',
      session.getCurrentItinerary(),
    );
    await this.itineraryRepository.create(session.getCurrentItinerary()!);
    return createResult.response;
  }

  private async modifyItinerary(
    message: string,
    session: TravelPlanningSession,
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

    return modifyResult.response;
  }
}
