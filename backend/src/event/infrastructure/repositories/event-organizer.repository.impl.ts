import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventOrganizerRepository } from '../../domain/repositories/event-organizer.repository';
import { EventOrganizer } from '../../domain/entities/event-organizer.entity';
import { EventOrganizerDocument } from '../schemas/event-organizer.schema';

@Injectable()
export class EventOrganizerRepositoryImpl extends EventOrganizerRepository {
  constructor(
    @InjectModel(EventOrganizer.name) private readonly eventOrganizerModel: Model<EventOrganizerDocument>,
  ) {
    super();
  }

  async create(eventOrganizer: EventOrganizer): Promise<EventOrganizer> {
    const newEventOrganizer = new this.eventOrganizerModel(eventOrganizer);
    const savedEventOrganizer = await newEventOrganizer.save();
    return this.toDomainEntity(savedEventOrganizer);
  }

  async findAll(businessAccountId: string): Promise<EventOrganizer[]> {
    const docs = await this.eventOrganizerModel.find({ businessAccountId }).exec();
    return docs.map(doc => this.toDomainEntity(doc));
  }
  
  async findById(id: string, businessAccountId: string): Promise<EventOrganizer | null> {
    const doc = await this.eventOrganizerModel.findOne({ _id: id, businessAccountId }).exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

  async update(id: string, updates: Partial<EventOrganizer>, businessAccountId: string): Promise<EventOrganizer | null> {
    const updatedDoc = await this.eventOrganizerModel.findOneAndUpdate({ _id: id, businessAccountId }, updates, { new: true }).exec();
    return updatedDoc ? this.toDomainEntity(updatedDoc) : null;
  }

  async delete(id: string, businessAccountId: string): Promise<boolean> {
    const result = await this.eventOrganizerModel.deleteOne({ _id: id, businessAccountId }).exec();
    return result.deletedCount > 0;
  }


  private toDomainEntity(doc: EventOrganizerDocument): EventOrganizer {
    return new EventOrganizer(
      doc._id.toString(),
      doc.businessAccountId,
      doc.organizerName,
      doc.contactEmail,
      doc.contactPhone,
      doc.organization,
    );
  }
}