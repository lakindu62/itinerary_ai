import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/user-management/domain/user/user.entity';
import { CreateUserDto } from '../dtos/user/create-user.dto';
import { TravelProfile } from 'src/user-management/domain/user/value-objects/traveller-profile.vo';
import { SocialSettings } from 'src/user-management/domain/user/value-objects/social-settings.vo';
import { UserRepository } from 'src/user-management/domain/repositories/user.repository';
import { ClerkIntegration } from 'src/user-management/infrastructure/integrations/clerk.integration';

// export const ownerId = '68d80a8f98be722407d63c21'; //TODO remove this after testing
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly clerkIntegration: ClerkIntegration,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const travelProfile = dto.travelProfile
      ? ({
          preferences: dto.travelProfile.preferences ?? [], // always an array
          loyaltyPoints: dto.travelProfile.loyaltyPoints ?? 0,
          bio: dto.travelProfile.bio,
          profilePicture: dto.travelProfile.profilePicture,
        } satisfies TravelProfile)
      : undefined;

    const socialSettings = dto.socialSettings
      ? ({
          isPublic: dto.socialSettings.isPublic ?? false,
          allowMessages: dto.socialSettings.allowMessages ?? true,
        } satisfies SocialSettings)
      : undefined;
    const user = new User(
      undefined,
      dto.clerkUserId,
      dto.email,
      dto.firstName,
      dto.lastName,
      dto.userType,
      dto.businessAccountId,
      dto.branchId,
      dto.role,
      travelProfile,
      socialSettings,
    );

    this.logger.debug(`Creating user with Clerk ID: ${user.clerkUserId}`);
    const dbUser = await this.userRepository.save(user);
    this.logger.debug(`User saved to database with ID: ${dbUser.id}`);

    this.logger.debug(
      `Updating Clerk public metadata for user with Clerk ID: ${dbUser.clerkUserId}`,
    );
    await this.clerkIntegration.updateUserPublicMetadata(dbUser.clerkUserId, {
      _id: dbUser.id,
    });
    this.logger.debug(
      `Clerk public metadata updated for user with Clerk ID: ${dbUser.clerkUserId}`,
    );

    return dbUser;
  }
  async deleteUser(id: string): Promise<User | null> {
    this.logger.debug(`Deleting user ${id}`);
    const deletedUser = await this.userRepository.delete(id);
    this.logger.debug(`Deleted user ${id}`, deletedUser);
    return deletedUser;
  }
}
