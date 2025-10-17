import { Injectable } from '@nestjs/common';
import { ItineraryRepository } from '../../domain/repositories/itinerary.repository';
import { ItineraryDto } from '@shared/types/itinerary/chat-itinerary.response.dto';

@Injectable()
export class ItineraryService {
  constructor(private readonly itineraryRepository: ItineraryRepository) {}

  async getMyItineraries(userId: string): Promise<ItineraryDto[]> {
    return await this.itineraryRepository.getMyItineraries(userId);
  }
}
