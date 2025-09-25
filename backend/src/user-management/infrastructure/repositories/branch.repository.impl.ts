import { Branch } from 'src/user-management/domain/branch/branch.entity';
import { BranchRepository } from 'src/user-management/domain/repositories/branch.repository';
import { BranchDocument } from '../schemas/branch.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BranchRepositoryImpl extends BranchRepository {
  constructor(
    @InjectModel('Branch') private readonly branchModel: Model<BranchDocument>,
  ) {
    super();
  }

  async save(branch: Branch): Promise<Branch> {
    const branchDoc = new this.branchModel(branch);
    const saved = await branchDoc.save();
    return this.toDomain(saved);
  }

  private toDomain(branchDoc: BranchDocument): Branch {
    return new Branch(
      branchDoc._id.toString(),
      branchDoc.businessAccountId,
      branchDoc.name,
      branchDoc.b_location,
      branchDoc.branchManagerId,
      branchDoc.staff,
      branchDoc.createdAt,
      branchDoc.updatedAt,
    );
  }
}
