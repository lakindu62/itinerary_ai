import { Injectable } from '@nestjs/common';
import { ItineraryRepository } from '../../domain/repositories/itinerary.repository';
import { Itinerary } from '../../domain/entities/itinerary.entity';
import { CreateItineraryDto } from '../dtos/create-itinerary.dto';
import { Day } from '../../domain/value-objects/itinerary/day.vo';
import { Activity } from '../../domain/value-objects/itinerary/activity.vo';

@Injectable()
export class ItineraryService {
  constructor(private readonly itineraryRepository: ItineraryRepository) {}

  async create(createDto: CreateItineraryDto): Promise<void> {
    const days = createDto.days.map((dayDto) => {
      const activities = dayDto.activities.map(
        (activityDto) =>
          new Activity(
            activityDto.time,
            activityDto.name,
            activityDto.description,
            activityDto.address,
            activityDto.type,
            activityDto.coordinates,
          ),
      );

      return new Day(
        dayDto.dayNumber,
        dayDto.date,
        dayDto.destination,
        activities,
      );
    });

    // Create the Itinerary instance
    const itinerary = new Itinerary(
      createDto.title,
      createDto.summary,
      days,
      createDto.accommodation,
      createDto.tips,
    );

    await this.itineraryRepository.create(itinerary);
  }
}
