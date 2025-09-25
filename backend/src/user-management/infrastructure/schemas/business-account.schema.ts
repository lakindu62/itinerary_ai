import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BusinessStatus } from 'src/user-management/domain/business-account/business-account.entity';

export type BusinessAccountDocument = BusinessAccount &
  Document & { _id: Types.ObjectId };

@Schema({ collection: 'business_accounts' })
export class BusinessAccount {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ default: BusinessStatus.ACTIVE, enum: Object.values(BusinessStatus) })
  status: BusinessStatus;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const BusinessAccountSchema =
  SchemaFactory.createForClass(BusinessAccount);
