import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MenuItemDocument = MenuItem & Document;

@Schema({ timestamps: true })
export class MenuItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop()
  image: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  businessProfileId: string;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ default: 0 })
  orderCount: number;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);