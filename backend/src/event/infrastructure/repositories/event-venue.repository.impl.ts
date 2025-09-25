import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventVenueRepository } from '../../domain/repositories/event-venue.repository';
import { EventVenue } from '../../domain/entities/event-venue.entity';
import { EventVenueDocument } from '../schemas/event-venue.schema';

@Injectable()
export class EventVenueRepositoryImpl extends EventVenueRepository {
  constructor(
    @InjectModel(EventVenue.name) private readonly eventVenueModel: Model<EventVenueDocument>,
  ) {
    super();
  }

  async create(eventVenue: EventVenue): Promise<any> {
    const newEventVenue = new this.eventVenueModel(eventVenue);
    const savedEventVenue = await newEventVenue.save();
    return this.toDomainEntity(savedEventVenue);
  }

  async findById(id: string): Promise<any | null> {
    const doc = await this.eventVenueModel.findById(id).exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

  private toDomainEntity(doc: EventVenueDocument): any {
    return {
      id: doc._id.toString(),
      venueName: doc.venueName,
      address: doc.address,
      city: doc.city,
      province: doc.province,
      postalCode: doc.postalCode,
      country: doc.country,
      capacity: doc.capacity,
      facilities: doc.facilities,
    };
  }
}
