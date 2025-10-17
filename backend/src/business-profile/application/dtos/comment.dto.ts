import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsString()
  userName: string;

  @IsEmail()
  userEmail: string;

  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  parentCommentId?: string;
}

export class UpdateCommentDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;
}