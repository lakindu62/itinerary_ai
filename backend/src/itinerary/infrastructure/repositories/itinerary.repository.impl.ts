import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ItineraryRepository } from '../../domain/repositories/itinerary.repository';
import { Itinerary } from '../../domain/entities/itinerary.entity';
import { ItineraryDocument } from '../schemas/itinerary.schema';

@Injectable()
export class ItineraryRepositoryImpl extends ItineraryRepository {
  constructor(
    @InjectModel(Itinerary.name)
    private readonly itineraryModel: Model<ItineraryDocument>,
  ) {
    super();
  }

  async create(itinerary: Itinerary): Promise<void> {
    console.log(JSON.stringify(itinerary, null, 2));

    const doc = new this.itineraryModel(itinerary);
    await doc.save();
    // return this.toDomainEntity(saved);
  }

  // private toDomainEntity(doc: ItineraryDocument): Itinerary {
  //   // Reconstruct domain value objects from the saved document
  //   const days = doc.days.map(
  //     (dayDoc) =>
  //       new Day(
  //         dayDoc.dayNumber,
  //         dayDoc.date,
  //         dayDoc.destination,
  //         dayDoc.activities.map(
  //           (activityDoc) =>
  //             new Activity(
  //               activityDoc.time,
  //               activityDoc.name,
  //               activityDoc.description,
  //               activityDoc.address,
  //               activityDoc.type,
  //               activityDoc.coordinates,
  //             ),
  //         ),
  //       ),
  //   );

  //   return new Itinerary(
  //     doc.title,
  //     doc.summary,
  //     days,
  //     doc.accommodation,
  //     doc.tips,
  //     doc._id.toString(),
  //   );
  // }
}
