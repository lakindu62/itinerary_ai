import { IsString, IsBoolean, IsNumber, IsDateString, Min } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  // @ApiProperty({ example: 'room_123456_abc' })
  @IsString()
  roomId: string;

  // @ApiProperty({ example: 'hotel_123456_abc' })
  @IsString()
  hotelId: string;

  // @ApiProperty({ example: 'user_owner_123' })
  @IsString()
  hotelOwnerId: string;

  // @ApiProperty({ example: '2024-01-15T00:00:00.000Z' })
  @IsDateString()
  startDate: string;

  // @ApiProperty({ example: '2024-01-20T00:00:00.000Z' })
  @IsDateString()
  endDate: string;

  // @ApiProperty({ example: true })
  @IsBoolean()
  breakfastIncluded: boolean;

  // @ApiProperty({ example: 'USD' })
  @IsString()
  currency: string;

  // @ApiProperty({ example: 750.00, minimum: 0 })
  @IsNumber()
  @Min(0)
  totalPrice: number;
}