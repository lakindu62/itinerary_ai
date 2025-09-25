import { Itinerary } from '../entities/itinerary.entity';

export abstract class ItineraryRepository {
  abstract create(itinerary: Itinerary): Promise<void>;
}
