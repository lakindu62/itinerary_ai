import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MediaDocument = Media & Document;

@Schema({ timestamps: true })
export class Media {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], required: true })
  files: string[];

  @Prop({ required: true })
  businessProfileId: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);