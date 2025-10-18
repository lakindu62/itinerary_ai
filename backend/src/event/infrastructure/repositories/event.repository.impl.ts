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

  
  async create(event: Event): Promise<Event> {
    const eventToSave = filterEventForDb(event);
    const newEvent = new this.eventModel(eventToSave);
    const savedEvent = await newEvent.save();
    return this.toDomainEntity(savedEvent);
  }

  async findAll(businessAccountId: string): Promise<Event[]> {
    const docs = await this.eventModel.find({ businessAccountId }).exec();
    return docs.map(doc => this.toDomainEntity(doc));
  }

  async findAllPublic(): Promise<Event[]> {
    const docs = await this.eventModel.find().exec();
    return docs.map(doc => this.toDomainEntity(doc));
  }

  async findById(id: string, businessAccountId: string): Promise<Event | null> {
    const doc = await this.eventModel.findOne({ _id: id, businessAccountId }).exec();
    if (!doc) return null;

    const mappings = await this.mappingRepository.findByEventId(id);
    const hashtags = mappings.map((m: any) => m.hashtag);

    return this.toDomainEntity(doc, hashtags);
  }

  async findPublicById(id: string): Promise<Event | null> {
    // Data is already populated, so no .populate() needed
    const doc = await this.eventModel.findById(id).exec();
    if (!doc) return null;

    const mappings = await this.mappingRepository.findByEventId(id);
    const hashtags = mappings.map((m: any) => m.hashtag);

    return this.toDomainEntity(doc, hashtags);
  }


  async update(id: string, updates: Partial<Event>, businessAccountId: string): Promise<Event | null> {
    const updatedDoc = await this.eventModel.findOneAndUpdate({ _id: id, businessAccountId }, updates, { new: true }).exec();
    return updatedDoc ? this.toDomainEntity(updatedDoc) : null;
  }

  async delete(id: string, businessAccountId: string): Promise<boolean> {
    const result = await this.eventModel.deleteOne({ _id: id, businessAccountId }).exec();
    return result.deletedCount > 0;
  }

  private toDomainEntity(doc: EventDocument, hashtags: any[] = []): Event {
    return new Event(
      doc._id.toString(),
      doc.businessAccountId,
      doc.eventName,
      doc.description,
      doc.startDate,
      doc.endDate,
      doc.startTime,
      doc.endTime,
      doc.maxAttendees,
      doc.ticketPrice,
      doc.eventStatus,
      doc.imagesUrl,
      doc.venue as any,
      doc.organizer as any,
      doc.category as any,
      hashtags,
    );
  }
}