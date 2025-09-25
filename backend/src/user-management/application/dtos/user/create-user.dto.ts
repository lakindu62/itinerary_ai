import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  UserRole,
  UserType,
} from 'src/user-management/domain/user/value-objects/user-role.vo';

class TravelProfileDto {
  @IsOptional()
  @IsString({ each: true })
  preferences?: string[];

  @IsOptional()
  loyaltyPoints?: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;
}

class SocialSettingsDto {
  @IsOptional()
  isPublic?: boolean;

  @IsOptional()
  allowMessages?: boolean;
}

export class CreateUserDto {
  @IsString()
  clerkUserId: string;

  @IsEmail()
  email: string;

  @IsEnum(UserType)
  userType: UserType;

  @IsOptional()
  @IsString()
  businessAccountId?: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @ValidateNested()
  @Type(() => TravelProfileDto)
  travelProfile?: TravelProfileDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialSettingsDto)
  socialSettings?: SocialSettingsDto;
}
