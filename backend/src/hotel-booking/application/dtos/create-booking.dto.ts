import {
  IsString,
  IsBoolean,
  IsNumber,
  IsDateString,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @IsString()
  @IsNotEmpty()
  hotelOwnerId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsBoolean()
  breakfastIncluded: boolean;

  @IsString()
  currency: string;

  @IsNumber()
  @Min(0)
  totalPrice: number;
}