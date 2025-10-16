// backend/src/itinerary/application/ports/event-read.port.ts
export interface EventSummary {
  id: string;
  eventName: string;
  description?: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  venue: {
    venueName?: string;
    city?: string;
    coordinates: [number, number];
  };
  category?: {
    categoryName?: string;
  };
}

export const EVENT_READ_PORT = 'EVENT_READ_PORT';

export interface EventReadPort {
  getPublicEvents(): Promise<EventSummary[]>;
  getPublicEventsByDestination(destination: string): Promise<EventSummary[]>;
}
