import { UserRepository } from 'src/user-management/domain/repositories/user.repository';
import { UserDocument } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/user-management/domain/user/user.entity';

Injectable();
export class UserRepositoryImpl extends UserRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {
    super();
  }

  async save(user: User): Promise<User> {
    const userDoc = new this.userModel(user);
    const saved = await userDoc.save();
    return this.toDomain(saved);
  }
  private toDomain(userDoc: UserDocument): User {
    return new User(
      userDoc._id.toString(),
      userDoc.clerkUserId,
      userDoc.email,
      userDoc.userType,
      userDoc.businessAccountId,
      userDoc.branchId,
      userDoc.role,
      userDoc.travelProfile,
      userDoc.socialSettings,
      userDoc.createdAt,
      userDoc.updatedAt,
    );
  }
}
