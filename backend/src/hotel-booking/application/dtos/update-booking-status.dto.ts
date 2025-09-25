import { IsBoolean, IsOptional, IsString } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookingStatusDto {
  // @ApiProperty({ example: true })
  @IsBoolean()
  paymentStatus: boolean;

  // @ApiProperty({ example: 'pi_1234567890', required: false })
  @IsOptional()
  @IsString()
  paymentIntentId?: string;
}