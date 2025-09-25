import { Injectable } from '@nestjs/common';
import { User } from 'src/user-management/domain/user/user.entity';
import { CreateUserDto } from '../dtos/user/create-user.dto';
import { TravelProfile } from 'src/user-management/domain/user/value-objects/traveller-profile.vo';
import { SocialSettings } from 'src/user-management/domain/user/value-objects/social-settings.vo';
import { UserRepository } from 'src/user-management/domain/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  createUser(dto: CreateUserDto): Promise<User> {
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
      undefined, // MongoDB will generate _id
      dto.clerkUserId,
      dto.email,
      dto.userType,
      dto.businessAccountId,
      dto.branchId,
      dto.role,
      travelProfile,
      socialSettings,
    );

    return this.userRepository.save(user);
  }
}
