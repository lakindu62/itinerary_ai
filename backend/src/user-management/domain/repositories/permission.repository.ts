import { UserPermission } from '../user/user-permission.entity';

export abstract class PermissionRepository {
  abstract save(permission: UserPermission): Promise<UserPermission>;
  //   abstract findByUserId(userId: string): Promise<UserPermission[]>;
  //   abstract findByUserAndBranch(
  //     userId: string,
  //     branchId?: string,
  //   ): Promise<UserPermission[]>;
  //   abstract findByUserAndBusiness(
  //     userId: string,
  //     businessAccountId?: string,
  //   ): Promise<UserPermission[]>;
  //   abstract delete(id: string): Promise<void>;
}
