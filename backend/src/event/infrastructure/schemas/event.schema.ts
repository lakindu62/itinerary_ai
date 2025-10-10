import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EventVenue } from './event-venue.schema';
import { EventOrganizer } from './event-organizer.schema';
import { EventCategory } from './event-category.schema';

export type EventDocument = Event & Document & { _id: Types.ObjectId; createdAt: string; updatedAt: string };

@Schema({
  timestamps: true,
  strict: 'throw',
})
export class Event {
  @Prop({ required: true })
  eventName: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startDate: string;

  @Prop({ required: true })
  endDate: string;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ required: true })
  maxAttendees: number;

  @Prop({ required: true })
  ticketPrice: number;

  @Prop({ required: true })
  eventStatus: string;

  @Prop({ type: [String] })
  imagesUrl: string[];

  @Prop({ type: Types.ObjectId, ref: 'EventVenue', required: true })
  venue: EventVenue;

  @Prop({ type: Types.ObjectId, ref: 'EventOrganizer', required: true })
  organizer: EventOrganizer;

  @Prop({ type: Types.ObjectId, ref: 'EventCategory', required: true })
  category: EventCategory;
}

export const EventSchema = SchemaFactory.createForClass(Event);
