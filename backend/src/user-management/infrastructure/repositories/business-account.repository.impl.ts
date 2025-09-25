import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BusinessAccountRepository } from 'src/user-management/domain/repositories/business-account.repository';
import { BusinessAccountDocument } from '../schemas/business-account.schema';
import { BusinessAccount } from 'src/user-management/domain/business-account/business-account.entity';
import { Model } from 'mongoose';

@Injectable()
export class BusinessAccountRepositoryImpl extends BusinessAccountRepository {
  constructor(
    @InjectModel('BusinessAccount')
    private readonly businessAccountModel: Model<BusinessAccountDocument>,
  ) {
    super();
  }

  async save(businessAccount: BusinessAccount): Promise<BusinessAccount> {
    const accountDoc = new this.businessAccountModel(businessAccount);
    const saved = await accountDoc.save();
    return this.toDomain(saved);
  }
  private toDomain(accountDoc: BusinessAccountDocument): BusinessAccount {
    return new BusinessAccount(
      accountDoc._id.toString(),
      accountDoc.name,
      accountDoc.ownerId,
      accountDoc.status,
      accountDoc.createdAt,
      accountDoc.updatedAt,
    );
  }
}
