import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventOrganizerDocument = EventOrganizer & Document & { _id: Types.ObjectId };

@Schema({
  timestamps: true,
  strict: 'throw',
})
export class EventOrganizer {
  @Prop({ required: true })
  organizerName: string;

  @Prop({ required: true })
  contactEmail: string;

  @Prop({ required: true })
  contactPhone: string;

  @Prop({ required: true })
  organization: string;
}

export const EventOrganizerSchema = SchemaFactory.createForClass(EventOrganizer);
