import { BusinessProfile } from '../entities/business-profile.entity';

export abstract class BusinessProfileRepository {
  abstract create(businessProfile: BusinessProfile): Promise<BusinessProfile>;
  abstract findById(id: string): Promise<BusinessProfile | null>;
  abstract findByOwnerId(ownerId: string): Promise<BusinessProfile[]>;
  abstract findByBusinessType(businessType: string): Promise<BusinessProfile[]>;
  abstract findActiveBusinesses(): Promise<BusinessProfile[]>;
  abstract update(id: string, updates: Partial<BusinessProfile>): Promise<BusinessProfile | null>;
  abstract updateRating(id: string, newRating: number, reviewCount: number): Promise<BusinessProfile | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract findByEmail(email: string): Promise<BusinessProfile | null>;
  abstract searchByName(searchTerm: string): Promise<BusinessProfile[]>;
}
