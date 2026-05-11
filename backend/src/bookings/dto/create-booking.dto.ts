import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class GuestsBreakdownDto {
  @IsNumber()
  @Min(1)
  adults: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  children?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  infants?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  pets?: number;
}

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  listingId: string;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @ValidateNested()
  @Type(() => GuestsBreakdownDto)
  guestsBreakdown: GuestsBreakdownDto;
}
