import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventRepository } from '../../domain/repositories/event.repository';
import { Event } from '../../domain/entities/event.entity';
import { EventDocument } from '../schemas/event.schema';

@Injectable()
export class EventRepositoryImpl extends EventRepository {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
  ) {
    super();
  }

  async create(event: Event): Promise<any> {
    const newEvent = new this.eventModel(event);
    const savedEvent = await newEvent.save();
    return this.toDomainEntity(savedEvent);
  }

  async findById(id: string): Promise<any | null> {
    const doc = await this.eventModel.findById(id).exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

async update(event: Event): Promise<any | null> {
    const updatedDoc = await this.eventModel.findByIdAndUpdate(event.id, event, { new: true }).exec();
    return updatedDoc ? this.toDomainEntity(updatedDoc) : null;
  }

  private toDomainEntity(doc: EventDocument): any {
    return {
      id: doc._id.toString(),
      eventName: doc.eventName,
      description: doc.description,
      startDate: doc.startDate,
      endDate: doc.endDate,
      startTime: doc.startTime,
      endTime: doc.endTime,
      maxAttendees: doc.maxAttendees,
      ticketPrice: doc.ticketPrice,
      eventStatus: doc.eventStatus,
      imagesUrl: doc.imagesUrl,
      createdAt: (doc as any).createdAt,
      updatedAt: (doc as any).updatedAt,
      venue: doc.venue as any,
      organizer: doc.organizer as any,
      category: doc.category as any,
    };
  }
}
