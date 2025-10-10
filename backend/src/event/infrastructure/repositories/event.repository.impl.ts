import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventRepository } from '../../domain/repositories/event.repository';
import { Event } from '../../domain/entities/event.entity';
import { EventDocument } from '../schemas/event.schema';
import { EventHashtagMappingRepository } from '../../domain/repositories/event-hashtag-mapping.repository';


function filterEventForDb(event: Event): any {
  const {
    hashtags, // exclude hashtags
    ...mappedEvent
  } = event;
  return mappedEvent;
}

@Injectable()
export class EventRepositoryImpl extends EventRepository {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
    private readonly mappingRepository: EventHashtagMappingRepository
  ) {
    super();
  }

  
  async create(event: Event): Promise<any> {
    // const newEvent = new this.eventModel(event);
    const eventToSave = filterEventForDb(event);
    const newEvent = new this.eventModel(eventToSave);
    const savedEvent = await newEvent.save();
    return this.toDomainEntity(savedEvent);
  }

  async findAll(): Promise<any[]> {
    const docs = await this.eventModel.find().exec();
    return docs.map(doc => this.toDomainEntity(doc));
  }

  // async findById(id: string): Promise<any | null> {
  //   const doc = await this.eventModel.findById(id).exec();
  //   return doc ? this.toDomainEntity(doc) : null;
  // }

  async findById(id: string): Promise<any | null> {
  const doc = await this.eventModel.findById(id).exec();
  if (!doc) return null;

  // Fetch hashtag mappings for this event
  const mappings = await this.mappingRepository.findByEventId(id);
  // Extract hashtags from the mappings
  const hashtags = mappings.map((m: any) => m.hashtag);

  return this.toDomainEntity(doc, hashtags);
}


  async update(event: Event): Promise<any | null> {
    // const updatedDoc = await this.eventModel.findByIdAndUpdate(event.id, event, { new: true }).exec();
    // return updatedDoc ? this.toDomainEntity(updatedDoc) : null;
    const eventToSave = filterEventForDb(event);
    const updatedDoc = await this.eventModel.findByIdAndUpdate(event.id, eventToSave, { new: true }).exec();
    return updatedDoc ? this.toDomainEntity(updatedDoc) : null;
  }

  async delete(id: string): Promise<void> {
    await this.eventModel.findByIdAndDelete(id).exec();
  }

  private toDomainEntity(doc: EventDocument, hashtags: any[] = []): any {
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
      hashtags: hashtags,
    };
  }
}
