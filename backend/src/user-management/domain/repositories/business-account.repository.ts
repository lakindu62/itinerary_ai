import { BusinessAccount } from '../business-account/business-account.entity';

export abstract class BusinessAccountRepository {
  abstract save(businessAccount: BusinessAccount): Promise<BusinessAccount>;
  //   abstract findById(id: string): Promise<BusinessAccount | null>;
  //   abstract findByOwnerId(ownerId: string): Promise<BusinessAccount[]>;
  //   abstract update(
  //     id: string,
  //     updates: Partial<BusinessAccount>,
  //   ): Promise<BusinessAccount>;
  //   abstract delete(id: string): Promise<void>;
}
