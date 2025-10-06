import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateHotelDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  locationDescription: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsBoolean()
  gym?: boolean;

  @IsOptional()
  @IsBoolean()
  spa?: boolean;

  @IsOptional()
  @IsBoolean()
  bar?: boolean;

  @IsOptional()
  @IsBoolean()
  laundry?: boolean;

  @IsOptional()
  @IsBoolean()
  restaurant?: boolean;

  @IsOptional()
  @IsBoolean()
  shopping?: boolean;

  @IsOptional()
  @IsBoolean()
  freeParking?: boolean;

  @IsOptional()
  @IsBoolean()
  bikeRental?: boolean;

  @IsOptional()
  @IsBoolean()
  freeWifi?: boolean;

  @IsOptional()
  @IsBoolean()
  movieNights?: boolean;

  @IsOptional()
  @IsBoolean()
  swimmingPool?: boolean;

  @IsOptional()
  @IsBoolean()
  coffeeShop?: boolean;
}