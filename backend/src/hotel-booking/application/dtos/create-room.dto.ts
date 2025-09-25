import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  // @ApiProperty({ example: 'Deluxe Ocean View Room' })
  @IsString()
  title: string;

  // @ApiProperty({ example: 'Spacious room with stunning ocean views' })
  @IsString()
  description: string;

  // @ApiProperty({ example: 2, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bedCount?: number;

  // @ApiProperty({ example: 4, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  guestCount?: number;

  // @ApiProperty({ example: 1, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bathroomCount?: number;

  // @ApiProperty({ example: 1, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  kingBed?: number;

  // @ApiProperty({ example: 0, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  queenBed?: number;

  // @ApiProperty({ example: 'https://example.com/room-image.jpg' })
  @IsString()
  image: string;

  // @ApiProperty({ example: 25.00, minimum: 0 })
  @IsNumber()
  @Min(0)
  breakfastPrice: number;

  // @ApiProperty({ example: 150.00, minimum: 0 })
  @IsNumber()
  @Min(0)
  roomPrice: number;

  // @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  roomService?: boolean;

  // @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  tv?: boolean;

  // @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  balcony?: boolean;

  // @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  freeWifi?: boolean;

  // @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  cityView?: boolean;

  // @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  oceanView?: boolean;

  // @ApiProperty({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  forestView?: boolean;

  // @ApiProperty({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  mountainView?: boolean;

  // @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  airCondition?: boolean;

  // @ApiProperty({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  soundProofed?: boolean;

  // @ApiProperty({ example: 'hotel_123456_abc' })
  @IsString()
  hotelId: string;
}