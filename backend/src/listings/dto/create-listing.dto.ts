import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  pricePerNight: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsNumber()
  @Min(1)
  maxGuests: number;

  @IsNumber()
  @IsOptional()
  bedrooms?: number;

  @IsNumber()
  @IsOptional()
  bathrooms?: number;

  @IsArray()
  @IsOptional()
  amenities?: string[];

  @IsString()
  @IsNotEmpty()
  host: string;
}
