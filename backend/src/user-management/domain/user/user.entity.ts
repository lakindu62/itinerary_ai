import { SocialSettings } from './value-objects/social-settings.vo';
import { TravelProfile } from './value-objects/traveller-profile.vo';
import { UserRole, UserType } from './value-objects/user-role.vo';

export class User {
  constructor(
    public readonly id: string | undefined,
    public readonly clerkUserId: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly userType: UserType,
    public readonly businessAccountId?: string,
    public readonly branchId?: string,
    public readonly role?: UserRole,
    public readonly travelProfile?: TravelProfile,
    public readonly socialSettings?: SocialSettings,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  public isTraveler(): boolean {
    return this.userType === UserType.TRAVELER;
  }

  public isBusinessUser(): boolean {
    return this.userType === UserType.BUSINESS_USER;
  }

  public isBusinessOwner(): boolean {
    return this.role === UserRole.BUSINESS_OWNER;
  }

  public isBranchManager(): boolean {
    return this.role === UserRole.BRANCH_MANAGER;
  }
}
