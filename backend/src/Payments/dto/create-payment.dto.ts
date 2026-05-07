import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreatePaymentDto {
  @IsNumber() @Min(0) amount: number;

  @IsString() @IsOptional() currency?: string;

  @IsNotEmpty()
  breakdown: {
    subtotal: number;
    cleaningFee?: number;
    serviceFee?: number;
    taxes?: number;
    total: number;
  };

  @IsString() @IsNotEmpty() bookingId: string;

  @IsString() @IsNotEmpty() userId: string;

  @IsString() @IsOptional() stripePaymentIntentId?: string;
}
