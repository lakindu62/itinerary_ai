import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class BusinessMedia extends Document {
  @Prop({ required: true })
  type: string; // 'image' | 'video'

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ required: true })
  businessProfileId: string;

  @Prop()
  title?: string;

  @Prop()
  description?: string;
}

export const BusinessMediaSchema = SchemaFactory.createForClass(BusinessMedia);