import { Injectable } from '@nestjs/common';
import { ItineraryRepository } from '../../domain/repositories/itinerary.repository';
import { ItineraryDto } from '@shared/types/itinerary/chat-itinerary.response.dto';
import { mapItineraryToDto } from '../mappers/itinerary-dto.mapper';

@Injectable()
export class ItineraryService {
  constructor(private readonly itineraryRepository: ItineraryRepository) {}

  async getMyItineraries(userId: string): Promise<ItineraryDto[]> {
    const items = await this.itineraryRepository.getMyItineraries(userId); // returns domain Itinerary[]
    return items.map(mapItineraryToDto); // convert to ItineraryDto[]
  }

  async getPublicItineraries(): Promise<ItineraryDto[]> {
    const items = await this.itineraryRepository.getPublicItineraries();
    return items.map(mapItineraryToDto);
  }

  async getPublicItineraryBySlug(slug: string): Promise<ItineraryDto | null> {
    const itinerary =
      await this.itineraryRepository.getPublicItineraryBySlug(slug);
    if (!itinerary) {
      return null;
    }
    return mapItineraryToDto(itinerary);
  }
}
