import { Injectable } from '@nestjs/common';
import { ItineraryRepository } from '../../domain/repositories/itinerary.repository';
import { Itinerary } from '../../domain/entities/itinerary.entity';
import { CreateItineraryDto } from '../dtos/create-itinerary.dto';

@Injectable()
export class ItineraryService {
  constructor(private readonly itineraryRepository: ItineraryRepository) {}

  async create(createDto: CreateItineraryDto): Promise<Itinerary> {
    // Business logic here
    const itinerary = new Itinerary(
      'null', // Will be set by database
      createDto.title,
      createDto.destination,
      true, // Default active
      new Date().toISOString(),
    );

    return await this.itineraryRepository.create(itinerary);
  }

  async findById(id: string): Promise<Itinerary | null> {
    return await this.itineraryRepository.findById(id);
  }
}
