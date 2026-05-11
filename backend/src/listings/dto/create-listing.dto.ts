import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  IsEnum,
  IsBoolean,
  Min,
  Max,
  MaxLength,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ListingType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  VILLA = 'villa',
  CABIN = 'cabin',
  STUDIO = 'studio',
  OTHER = 'other',
}

class LocationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  address: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  country: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

class HouseRulesDto {
  @IsBoolean()
  @IsOptional()
  petsAllowed?: boolean;

  @IsBoolean()
  @IsOptional()
  smokingAllowed?: boolean;

  @IsBoolean()
  @IsOptional()
  partiesAllowed?: boolean;

  @IsNumber()
  @Min(0)
  @Max(23)
  @IsOptional()
  checkInTime?: number;

  @IsNumber()
  @Min(0)
  @Max(23)
  @IsOptional()
  checkOutTime?: number;
}

class AvailabilityWindowDto {
  @IsString()
  @IsNotEmpty()
  from: string;

  @IsString()
  @IsNotEmpty()
  to: string;
}

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @IsEnum(ListingType)
  type: ListingType;

  @IsNumber()
  @Min(0)
  pricePerNight: number;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsArray()
  @ArrayMinSize(1)
  images: string[];

  @IsNumber()
  @Min(1)
  maxGuests: number;

  @IsNumber()
  @Min(0)
  bedrooms: number;

  @IsNumber()
  @Min(1)
  beds: number;

  @IsNumber()
  @Min(1)
  bathrooms: number;

  @IsArray()
  @IsOptional()
  amenities?: string[];

  @ValidateNested()
  @Type(() => HouseRulesDto)
  @IsOptional()
  houseRules?: HouseRulesDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityWindowDto)
  @IsOptional()
  availability?: AvailabilityWindowDto[];
}
