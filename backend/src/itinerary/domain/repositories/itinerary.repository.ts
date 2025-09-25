import { Itinerary } from '../entities/itinerary.entity';

export abstract class ItineraryRepository {
  abstract create(itinerary: Itinerary): Promise<Itinerary>;
  abstract findById(id: string): Promise<Itinerary | null>;
}
