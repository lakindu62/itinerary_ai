import { UserRole } from '../user/value-objects/user-role.vo';
import { BLocation } from './value-objects/b-location.vo';

export interface StaffMember {
  userId: string;
  role: UserRole;
  joinedAt: Date;
}

export class Branch {
  constructor(
    public readonly id: string | undefined,
    public readonly businessAccountId: string,
    public readonly name: string,
    public readonly location: BLocation,
    public readonly branchManagerId?: string,
    public readonly staff: StaffMember[] = [],
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  public addStaff(userId: string, role: UserRole): void {
    const existingStaff = this.staff.find((s) => s.userId === userId);
    if (!existingStaff) {
      this.staff.push({
        userId,
        role,
        joinedAt: new Date(),
      });
    }
  }

  public removeStaff(userId: string): void {
    const index = this.staff.findIndex((s) => s.userId === userId);
    if (index !== -1) {
      this.staff.splice(index, 1);
    }
  }
}
