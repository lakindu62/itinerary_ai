import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventRsvpRepository } from '../../domain/repositories/event-rsvp.repository';
import { EventRsvp } from '../../domain/entities/event-rsvp.entity';
import { EventRsvpDocument } from '../schemas/event-rsvp.schema';

@Injectable()
export class EventRsvpRepositoryImpl extends EventRsvpRepository {
  constructor(
    @InjectModel(EventRsvp.name) private readonly eventRsvpModel: Model<EventRsvpDocument>,
  ) {
    super();
  }

  async create(eventRsvp: EventRsvp): Promise<any> {
    const newEventRsvp = new this.eventRsvpModel(eventRsvp);
    const savedEventRsvp = await newEventRsvp.save();
    return this.toDomainEntity(savedEventRsvp);
  }

  async findById(id: string): Promise<any | null> {
    const doc = await this.eventRsvpModel.findById(id).exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

  async update(eventRsvp: EventRsvp): Promise<any | null> {
    const updatedDoc = await this.eventRsvpModel.findByIdAndUpdate(eventRsvp.id, eventRsvp, { new: true }).exec();
    return updatedDoc ? this.toDomainEntity(updatedDoc) : null;
  }

  async delete(id: string): Promise<void> {
    await this.eventRsvpModel.findByIdAndDelete(id).exec();
  }

  private toDomainEntity(doc: EventRsvpDocument): any {
    return {
      id: doc._id.toString(),
      event: doc.event as any,
      userId: doc.userId,
      rsvpStatus: doc.rsvpStatus,
      createdAt: (doc as any).createdAt,
      guestCount: doc.guestCount,
    };
  }
}
