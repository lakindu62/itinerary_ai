import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventHashtagDocument = EventHashtag & Document & { _id: Types.ObjectId };

@Schema({
  timestamps: true,
  strict: 'throw',
})
export class EventHashtag {
  @Prop({ required: true, unique: true })
  hashtagName: string;
}

export const EventHashtagSchema = SchemaFactory.createForClass(EventHashtag);
