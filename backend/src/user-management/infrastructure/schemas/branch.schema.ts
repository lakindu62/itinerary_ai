import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StaffMember } from 'src/user-management/domain/branch/branch.entity';
import { BLocation } from 'src/user-management/domain/branch/value-objects/b-location.vo';

export type BranchDocument = Branch & Document & { _id: Types.ObjectId };

@Schema({ collection: 'branches' })
export class Branch {
  @Prop({ required: true })
  businessAccountId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  bLocation: BLocation;

  @Prop()
  branchManagerId?: string;

  @Prop()
  primaryContactNumber: string;

  @Prop({ type: [Object], default: [] })
  staff: StaffMember[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
