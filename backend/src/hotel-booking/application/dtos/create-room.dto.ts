import { IsString, IsNumber, IsBoolean, IsOptional, Min, IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bedCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  guestCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bathroomCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  kingBed?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  queenBed?: number;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @Min(0)
  breakfastPrice: number;

  @IsNumber()
  @Min(0)
  roomPrice: number;

  @IsOptional()
  @IsBoolean()
  roomService?: boolean;

  @IsOptional()
  @IsBoolean()
  tv?: boolean;

  @IsOptional()
  @IsBoolean()
  balcony?: boolean;

  @IsOptional()
  @IsBoolean()
  freeWifi?: boolean;

  @IsOptional()
  @IsBoolean()
  cityView?: boolean;

  @IsOptional()
  @IsBoolean()
  oceanView?: boolean;

  @IsOptional()
  @IsBoolean()
  forestView?: boolean;

  @IsOptional()
  @IsBoolean()
  mountainView?: boolean;

  @IsOptional()
  @IsBoolean()
  airCondition?: boolean;

  @IsOptional()
  @IsBoolean()
  soundProofed?: boolean;

  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}