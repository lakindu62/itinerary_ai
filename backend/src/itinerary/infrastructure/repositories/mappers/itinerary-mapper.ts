import { Injectable } from '@nestjs/common';
import { Itinerary } from 'src/itinerary/domain/entities/itinerary.entity';
import {
  ItineraryDocument,
  DayDocument,
  ActivitySubdoc,
} from '../../schemas/itinerary.schema';
import { Day } from 'src/itinerary/domain/value-objects/itinerary';
import { Activity } from 'src/itinerary/domain/value-objects/itinerary/activity.vo';

@Injectable()
export class ItineraryMapper {
  /**
   * Maps activity from document to domain entity
   */
  private static mapActivity(activitySchema: ActivitySubdoc): Activity {
    return new Activity(
      activitySchema._id?.toString(),
      activitySchema.time,
      activitySchema.name,
      activitySchema.description,
      activitySchema.address,
      activitySchema.type,
      activitySchema.coordinates,
      activitySchema.additionalDetails,
      activitySchema.budgetedAmount,
      activitySchema.actualSpend,
    );
  }
  /**
   * Maps day from document to domain entity
   */
  private static mapDay(day: DayDocument): Day {
    return new Day(
      day.dayNumber,
      day.date,
      day.destination,
      day.activities.map((activity) => this.mapActivity(activity)),
    );
  }

  /**
   * Maps full itinerary document to domain entity with all days
   */
  static toDomainEntity(doc: ItineraryDocument): Itinerary {
    return new Itinerary(
      doc.user.toString(),
      doc.title,
      doc.summary,
      doc.days.length > 0 ? doc.days.map((day) => this.mapDay(day)) : [],
      doc.accommodation,
      doc.tips,
      doc.slug,
      doc._id.toString(),
    );
  }
  /**
   * Maps itinerary document to domain entity with only the first day
   * Used for list views where full details aren't needed
   */
  static toDomainEntityWithFirstDay(doc: ItineraryDocument): Itinerary {
    return new Itinerary(
      doc.user.toString(),
      doc.title,
      doc.summary,
      doc.days.length > 0 ? [this.mapDay(doc.days[0])] : [],
      doc.accommodation,
      doc.tips,
      doc.slug,
      doc._id.toString(),
    );
  }
}
