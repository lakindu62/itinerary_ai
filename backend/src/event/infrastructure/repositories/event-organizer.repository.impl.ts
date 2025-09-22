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

  async create(eventOrganizer: EventOrganizer): Promise<any> {
    const newEventOrganizer = new this.eventOrganizerModel(eventOrganizer);
    const savedEventOrganizer = await newEventOrganizer.save();
    return this.toDomainEntity(savedEventOrganizer);
  }

  async findById(id: string): Promise<any | null> {
    const doc = await this.eventOrganizerModel.findById(id).exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

  async update(eventOrganizer: EventOrganizer): Promise<any | null> {
    const updatedDoc = await this.eventOrganizerModel.findByIdAndUpdate(eventOrganizer.id, eventOrganizer, { new: true }).exec();
    return updatedDoc ? this.toDomainEntity(updatedDoc) : null;
  }

  async delete(id: string): Promise<void> {
    await this.eventOrganizerModel.findByIdAndDelete(id).exec();
  }


  private toDomainEntity(doc: EventOrganizerDocument): any {
    return {
      id: doc._id.toString(),
      organizerName: doc.organizerName,
      contactEmail: doc.contactEmail,
      contactPhone: doc.contactPhone,
      organization: doc.organization,
      createdAt: (doc as any).createdAt,
      updatedAt: (doc as any).updatedAt,
    };
  }
}
