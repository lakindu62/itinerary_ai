import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BusinessMediaDocument = BusinessMedia & Document;

@Schema({ timestamps: true })
export class BusinessMedia {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], required: true })
  media: string[];

  @Prop({ required: true })
  businessProfileId: string;
}

export const BusinessMediaSchema = SchemaFactory.createForClass(BusinessMedia);