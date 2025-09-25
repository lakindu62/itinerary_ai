import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoomDto {
  // @ApiProperty({ example: 'Deluxe Ocean View Room', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  // @ApiProperty({ example: 'Spacious room with stunning ocean views', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  // @ApiProperty({ example: 2, minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bedCount?: number;

  // @ApiProperty({ example: 4, minimum: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  guestCount?: number;

  // @ApiProperty({ example: 1, minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bathroomCount?: number;

  // @ApiProperty({ example: 1, minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  kingBed?: number;

  // @ApiProperty({ example: 0, minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  queenBed?: number;

  // @ApiProperty({ example: 'https://example.com/room-image.jpg', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  // @ApiProperty({ example: 25.00, minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  breakfastPrice?: number;

  // @ApiProperty({ example: 150.00, minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  roomPrice?: number;

  // @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  roomService?: boolean;

  // @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  tv?: boolean;

  // @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  balcony?: boolean;

  // @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  freeWifi?: boolean;

  // @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  cityView?: boolean;

  // @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  oceanView?: boolean;

  // @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  forestView?: boolean;

  // @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  mountainView?: boolean;

  // @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  airCondition?: boolean;

  // @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  soundProofed?: boolean;
}