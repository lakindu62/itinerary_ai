import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async create(eventRsvp: EventRsvp): Promise<EventRsvp> {
    const rsvpToSave = {
      ...eventRsvp,
      event: eventRsvp.event.id, // Ensure only the ID is saved
    };
    const newEventRsvp = new this.eventRsvpModel(rsvpToSave);
    const savedEventRsvp = await newEventRsvp.save();
    return this.toDomainEntity(savedEventRsvp);
  }

  async findAll(businessAccountId: string): Promise<EventRsvp[]> {
    const docs = await this.eventRsvpModel.find({ businessAccountId }).populate('event').exec(); 
    return docs.map(doc => this.toDomainEntity(doc));
  }

  async findById(id: string, businessAccountId: string): Promise<EventRsvp | null> {
    const doc = await this.eventRsvpModel.findOne({ _id: id, businessAccountId }).exec();
    return doc ? this.toDomainEntity(doc) : null;
  }

  async update(id: string, updates: Partial<EventRsvp>, businessAccountId: string): Promise<EventRsvp | null> {
    const updatedDoc = await this.eventRsvpModel.findOneAndUpdate({ _id: id, businessAccountId }, updates, { new: true }).exec();
    return updatedDoc ? this.toDomainEntity(updatedDoc) : null;
  }

  async delete(id: string, businessAccountId: string): Promise<boolean> {
    const result = await this.eventRsvpModel.deleteOne({ _id: id, businessAccountId }).exec();
    return result.deletedCount > 0;
  }

  private toDomainEntity(doc: EventRsvpDocument): EventRsvp {
    return new EventRsvp(
      doc._id.toString(),
      doc.businessAccountId,
      doc.event as any,
      doc.userId,
      doc.rsvpStatus,
      doc.guestCount,
    );
  }

  async getTotalGuestCountForEvent(eventId: string): Promise<number> {
    // Use a direct string comparison for the event ID, which is more robust.
    const rsvps = await this.eventRsvpModel.find({ event: eventId }).exec();
    console.log(`RSVPs for event ${eventId}:`, rsvps); // Added for debugging
    if (!rsvps || rsvps.length === 0) {
      return 0;
    }
    return rsvps.reduce((total, rsvp) => total + rsvp.guestCount, 0);
  }
}