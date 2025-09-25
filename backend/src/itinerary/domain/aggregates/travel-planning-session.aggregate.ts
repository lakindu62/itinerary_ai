import { Conversation } from '../entities/conversation.entity';
import { Itinerary } from '../entities/itinerary.entity';
import { ConversationContext } from '../value-objects/conversation';
import { Day } from '../value-objects/itinerary';

export class TravelPlanningSession {
  private conversation: Conversation;
  private currentItinerary?: Itinerary;

  constructor(
    public readonly id: string,
    conversation?: Conversation,
  ) {
    this.conversation = conversation || new Conversation(id);
  }

  // Conversation operations
  addUserMessage(message: string): void {
    this.conversation.addMessage('user', message);
  }

  getConversationMessages() {
    return this.conversation.getMessages();
  }

  addAssistantMessage(message: string): void {
    this.conversation.addMessage('assistant', message);
  }

  getContext(): ConversationContext {
    return this.conversation.getContext();
  }

  updateContext(updates: Partial<ConversationContext>): void {
    this.conversation.updateContext(updates);
  }

  getLastUserMessage() {
    return this.conversation.getLastUserMessage();
  }

  // Itinerary operations
  createItinerary(
    title: string,
    summary: string,
    days: Day[],
    accommodation: string,
    tips: string[],
  ): void {
    this.currentItinerary = new Itinerary(
      title,
      summary,
      days,
      accommodation,
      tips,
    );

    // Update conversation context to reflect itinerary creation
    this.updateContext({
      stage: 'modifying',
    });
  }

  modifyItinerary(
    title: string,
    summary: string,
    days: Day[],
    accommodation: string,
    tips: string[],
  ): void {
    if (!this.currentItinerary) {
      throw new Error('Cannot modify itinerary: no itinerary exists');
    }

    this.currentItinerary = new Itinerary(
      title,
      summary,
      days,
      accommodation,
      tips,
    );
  }

  getCurrentItinerary(): Itinerary | undefined {
    return this.currentItinerary;
  }

  // Business logic methods
  isReadyForItineraryCreation(): boolean {
    const context = this.getContext();
    return !!(
      context.destination &&
      context.dates &&
      context.travelers &&
      context.stage === 'creating'
    );
  }

  canModifyItinerary(): boolean {
    return !!(this.currentItinerary && this.getContext().stage === 'modifying');
  }

  needsClarification(): boolean {
    const context = this.getContext();
    return context.stage === 'clarifying' || context.stage === 'initial';
  }

  // Domain events (if you implement event sourcing later)
  getDomainEvents(): any[] {
    // Return accumulated domain events
    return [];
  }

  clearDomainEvents(): void {
    // Clear accumulated domain events after publishing
  }
}
