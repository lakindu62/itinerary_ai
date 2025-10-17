import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ItineraryRepository } from '../../domain/repositories/itinerary.repository';
import {
  ItineraryDto,
  ItineraryVisibilityDto,
} from '@shared/types/itinerary/chat-itinerary.response.dto';
import { mapItineraryToDto } from '../mappers/itinerary-dto.mapper';

@Injectable()
export class ItineraryService {
  constructor(private readonly itineraryRepository: ItineraryRepository) {}

  async setVisibility(
    userId: string,
    itineraryId: string,
    payload: ItineraryVisibilityDto,
  ) {
    const itin = await this.itineraryRepository.findById(itineraryId);
    if (!itin) throw new NotFoundException('Itinerary not found');
    console.log(
      '🚀 ~ ItineraryService ~ setVisibility ~ itin.user.toString() !== userId.toString():',
      itin.user.toString(),
      userId.toString(),
    );
    if (itin.user.toString() !== userId.toString())
      throw new ForbiddenException();

    return this.itineraryRepository.updateVisibility(
      itineraryId,
      payload.visibility,
    );
  }

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
