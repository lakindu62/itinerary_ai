import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Event } from './event.schema';

export type EventRsvpDocument = EventRsvp & Document & { _id: Types.ObjectId };

@Schema({
  timestamps: true,
  strict: 'throw',
})
export class EventRsvp {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  event: Event;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  rsvpStatus: string;

  @Prop({ required: true })
  guestCount: number;
}

export const EventRsvpSchema = SchemaFactory.createForClass(EventRsvp);
