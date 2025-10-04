import { UserRepository } from 'src/user-management/domain/repositories/user.repository';
import { UserDocument } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/user-management/domain/user/user.entity';

Injectable();
export class UserRepositoryImpl extends UserRepository {
  private readonly logger = new Logger(UserRepositoryImpl.name);
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
  async update(id: string, updates: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updates, { new: true })
      .exec();
    return this.toDomain(updatedUser!);
  }
  async delete(id: string): Promise<User | null> {
    // Check if id is a valid MongoDB ObjectId (24 hex chars)
    const isMongoId = /^[a-fA-F0-9]{24}$/.test(id);
    let deletedUser: UserDocument | null;

    if (isMongoId) {
      deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    } else {
      // Assume id is a clerkUserId
      deletedUser = await this.userModel
        .findOneAndDelete({ clerkUserId: id })
        .exec();
    }
    return deletedUser ? this.toDomain(deletedUser) : null;
  }
  private toDomain(userDoc: UserDocument): User {
    return new User(
      userDoc._id.toString(),
      userDoc.clerkUserId,
      userDoc.email,
      userDoc.firstName,
      userDoc.lastName,
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
