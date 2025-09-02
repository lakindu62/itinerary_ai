export class BusinessProfile {
  constructor(
    public readonly id: string,
    public readonly businessName: string,
    public readonly businessType: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly ownerId: string,
    public readonly description?: string,
    public readonly logoImage?: string,
    public readonly coverImage?: string,
    public readonly activeStatus: boolean = true,
    public readonly averageRating: number = 0,
    public readonly totalReviews: number = 0,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  // Business logic methods
  public isActive(): boolean {
    return this.activeStatus;
  }

  public hasGoodRating(): boolean {
    return this.averageRating >= 4.0;
  }

  public updateRating(newRating: number, reviewCount: number): BusinessProfile {
    return new BusinessProfile(
      this.id,
      this.businessName,
      this.businessType,
      this.email,
      this.phone,
      this.ownerId,
      this.description,
      this.logoImage,
      this.coverImage,
      this.activeStatus,
      newRating,
      reviewCount,
      this.createdAt,
      new Date(), // updatedAt
    );
  }

  public updateProfile(updates: Partial<BusinessProfile>): BusinessProfile {
    return new BusinessProfile(
      this.id,
      updates.businessName ?? this.businessName,
      updates.businessType ?? this.businessType,
      updates.email ?? this.email,
      updates.phone ?? this.phone,
      this.ownerId,
      updates.description ?? this.description,
      updates.logoImage ?? this.logoImage,
      updates.coverImage ?? this.coverImage,
      updates.activeStatus ?? this.activeStatus,
      updates.averageRating ?? this.averageRating,
      updates.totalReviews ?? this.totalReviews,
      this.createdAt,
      new Date(), // updatedAt
    );
  }
}
