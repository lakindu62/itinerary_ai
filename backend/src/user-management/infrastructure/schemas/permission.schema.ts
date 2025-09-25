import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Permission as PermissionEntity } from 'src/user-management/domain/user/value-objects/permission.vo';
import { UserRole } from 'src/user-management/domain/user/value-objects/user-role.vo';

export type PermissionDocument = Permission &
  Document & { _id: Types.ObjectId };
@Schema({ collection: 'permissions' })
class Permission {
  @Prop({ required: true })
  userId: string;

  @Prop()
  businessAccountId?: string;

  @Prop()
  branchId?: string;

  @Prop({ type: [String], enum: Object.values(Permission), default: [] })
  permissions: PermissionEntity[];

  @Prop({ enum: Object.values(UserRole) })
  inheritedFrom?: UserRole;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
