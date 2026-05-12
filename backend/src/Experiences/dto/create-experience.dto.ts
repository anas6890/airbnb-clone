import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  IsEnum,
  IsDateString,
  Min,
  MaxLength,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ExperienceCategory {
  OUTDOOR = 'outdoor',
  FOOD = 'food',
  ART = 'art',
  MUSIC = 'music',
  SPORT = 'sport',
  CULTURE = 'culture',
  OTHER = 'other',
}

class ExperienceLocationDto {
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

class ScheduleSlotDto {
  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;
}

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsEnum(ExperienceCategory)
  category: ExperienceCategory;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @IsNumber()
  @Min(1)
  durationMinutes: number;

  @IsNumber()
  @Min(0)
  pricePerPerson: number;

  @IsNumber()
  @Min(1)
  maxGroupSize: number;

  @ValidateNested()
  @Type(() => ExperienceLocationDto)
  location: ExperienceLocationDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleSlotDto)
  @IsOptional()
  schedule?: ScheduleSlotDto[];

  @IsArray()
  @IsOptional()
  included?: string[];

  @IsArray()
  @ArrayMinSize(1)
  images: string[];
}
