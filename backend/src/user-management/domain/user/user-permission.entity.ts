import { Permission } from './value-objects/permission.vo';
import { UserRole } from './value-objects/user-role.vo';

export class UserPermission {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly businessAccountId?: string,
    public readonly branchId?: string,
    public readonly permissions: Permission[] = [],
    public readonly inheritedFrom?: UserRole,
    public readonly createdAt: Date = new Date(),
  ) {}

  public hasPermission(permission: Permission): boolean {
    return this.permissions.includes(permission);
  }
}
