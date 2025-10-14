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

  async create(eventVenue: EventVenue): Promise<EventVenue> {
    const newEventVenue = new this.eventVenueModel(eventVenue);
    const savedEventVenue = await newEventVenue.save();
    return this.toDomainEntity(savedEventVenue);
  }

  async findById(id: string, businessAccountId: string): Promise<EventVenue | null> {
    const doc = await this.eventVenueModel.findOne({ _id: id, businessAccountId }).exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

  async update(id: string, updates: Partial<EventVenue>, businessAccountId: string): Promise<EventVenue | null> {
    const updatedDoc = await this.eventVenueModel.findOneAndUpdate({ _id: id, businessAccountId }, updates, { new: true }).exec();
    return updatedDoc ? this.toDomainEntity(updatedDoc) : null;
  }

  async delete(id: string, businessAccountId: string): Promise<boolean> {
    const result = await this.eventVenueModel.deleteOne({ _id: id, businessAccountId }).exec();
    return result.deletedCount > 0;
  }

  async findAll(businessAccountId: string): Promise<EventVenue[]> {
    const docs = await this.eventVenueModel.find({ businessAccountId }).exec();
    return docs.map(doc => this.toDomainEntity(doc));
  }


  private toDomainEntity(doc: EventVenueDocument): EventVenue {
    return new EventVenue(
      doc._id.toString(),
      doc.businessAccountId,
      doc.venueName,
      doc.address,
      doc.city,
      doc.province,
      doc.postalCode,
      doc.country,
      doc.capacity,
      doc.facilities,
    );
  }
}