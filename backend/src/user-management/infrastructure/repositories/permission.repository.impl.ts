import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserPermission } from 'src/user-management/domain/user/user-permission.entity';
import { PermissionDocument } from '../schemas/permission.schema';
import { Model } from 'mongoose';
import { PermissionRepository } from 'src/user-management/domain/repositories/permission.repository';

@Injectable()
export class PermissionRepositoryImpl extends PermissionRepository {
  constructor(
    @InjectModel('Permission')
    private readonly permissionModel: Model<PermissionDocument>,
  ) {
    super();
  }

  async save(permission: UserPermission): Promise<UserPermission> {
    const permissionDoc = new this.permissionModel(permission);
    const saved = await permissionDoc.save();
    return this.toDomain(saved);
  }

  private toDomain(permissionDoc: PermissionDocument): UserPermission {
    return new UserPermission(
      permissionDoc._id.toString(),
      permissionDoc.userId,
      permissionDoc.businessAccountId,
      permissionDoc.branchId,
      permissionDoc.permissions,
      permissionDoc.inheritedFrom,
      permissionDoc.createdAt,
    );
  }
}
