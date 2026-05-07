import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  listing: string;

  @IsString()
  @IsNotEmpty()
  guest: string;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @IsNumber()
  @Min(1)
  guests: number;

  @IsNumber()
  @Min(0)
  totalPrice: number;
}
