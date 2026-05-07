import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
  IsEnum,
} from 'class-validator';

export class CreateExperienceDto {
  @IsString() @IsNotEmpty() title: string;

  @IsEnum(['outdoor', 'food', 'art', 'music', 'sport', 'culture', 'other'])
  category: string;

  @IsString() @IsNotEmpty() description: string;

  @IsNumber() @Min(1) duration: number;

  @IsNumber() @Min(0) pricePerPerson: number;

  @IsNumber() @Min(1) maxGroupSize: number;

  @IsNotEmpty() location: {
    address: string;
    city: string;
    country: string;
    lat?: number;
    lng?: number;
  };

  @IsArray() @IsOptional() included?: string[];

  @IsArray() @IsOptional() images?: string[];

  @IsString() @IsNotEmpty() hostId: string;
}
