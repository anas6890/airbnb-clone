import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  targetId: string;

  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @IsEnum(['listing', 'experience'])
  type: string;

  @IsEnum(['Listing', 'Experience'])
  targetModel: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  comment: string;
}
