import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Event } from './event.schema';
import { EventHashtag } from './event-hashtag.schema';

export type EventHashtagMappingDocument = EventHashtagMapping & Document;

@Schema({
  timestamps: true,
  strict: 'throw',
  _id: false,
})
export class EventHashtagMapping {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  event: Event;

  @Prop({ type: Types.ObjectId, ref: 'EventHashtag', required: true })
  hashtag: EventHashtag;
}

export const EventHashtagMappingSchema = SchemaFactory.createForClass(EventHashtagMapping);

EventHashtagMappingSchema.index({ event: 1, hashtag: 1 }, { unique: true });
