import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SocialSettings } from 'src/user-management/domain/user/value-objects/social-settings.vo';
import { TravelProfile } from 'src/user-management/domain/user/value-objects/traveller-profile.vo';
import {
  UserRole,
  UserType,
} from 'src/user-management/domain/user/value-objects/user-role.vo';

export type UserDocument = User & Document & { _id: Types.ObjectId };

@Schema({ collection: 'users' })
export class User {
  @Prop({ required: true, unique: true })
  clerkUserId: string;

  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, enum: Object.values(UserType) })
  userType: UserType;

  @Prop()
  businessAccountId?: string;

  @Prop()
  branchId?: string;

  @Prop({ enum: Object.values(UserRole) })
  role?: UserRole;

  @Prop({ type: Object })
  travelProfile?: TravelProfile;

  @Prop({ type: Object })
  socialSettings?: SocialSettings;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
