import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum PaymentCurrency {
  USD = 'USD',
  EUR = 'EUR',
  MAD = 'MAD',
  GBP = 'GBP',
}

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @IsEnum(PaymentCurrency)
  @IsOptional()
  currency?: PaymentCurrency;
}
