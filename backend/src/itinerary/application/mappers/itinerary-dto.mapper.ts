import { Itinerary } from 'src/itinerary/domain/entities/itinerary.entity';
import { Day } from 'src/itinerary/domain/value-objects/itinerary/day.vo';
import { Activity } from 'src/itinerary/domain/value-objects/itinerary/activity.vo';
import {
  ItineraryDto,
  DayDto,
  ActivityDto,
} from '@shared/types/itinerary/chat-itinerary.response.dto';

function mapActivity(a: Activity): ActivityDto {
  const base = {
    id: a.id ?? undefined,
    time: a.time,
    name: a.name,
    description: a.description,
    address: a.address,
    coordinates: a.coordinates,
    budgetedAmount: a.budgetedAmount,
    actualSpend: a.actualSpend,
  } as const;

  switch (a.type) {
    case 'hotel':
      return {
        ...base,
        type: 'hotel',
        // DTO requires an object; provide empty when missing
        additionalDetails: {
          id: a.additionalDetails?.id,
          imageUrl: a.additionalDetails?.imageUrl,
          venueName: undefined,
        },
      };
    case 'event':
      return {
        ...base,
        type: 'event',
        additionalDetails: {
          id: a.additionalDetails?.id,
          imageUrl: a.additionalDetails?.imageUrl,
          startDate: a.additionalDetails?.startDate,
          endDate: a.additionalDetails?.endDate,
          startTime: a.additionalDetails?.startTime,
          endTime: a.additionalDetails?.endTime,
          venueName: undefined,
        },
      };
    case 'restaurant':
    case 'attraction':
    case 'other':
      return { ...base, type: a.type };
    default:
      // Guard: coerce unknowns to "other" to satisfy union
      return { ...base, type: 'other' };
  }
}

function mapDay(d: Day): DayDto {
  return {
    dayNumber: d.dayNumber,
    date: d.date,
    destination: d.destination,
    activities: d.activities.map(mapActivity),
  };
}

export function mapItineraryToDto(itin: Itinerary): ItineraryDto {
  return {
    title: itin.title,
    summary: itin.summary,
    days: itin.days.map(mapDay),
    accommodation: itin.accommodation,
    tips: itin.tips,
    id: itin.id,
    slug: itin.slug,
  };
}
