import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { RequestWithUser } from '../auth/types/request-with-user';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // POST /reviews — authentifie
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateReviewDto, @Request() req: RequestWithUser) {
    return this.reviewsService.create(dto, req.user.sub);
  }

  // GET /reviews/listing/:listingId — public
  @Get('listing/:listingId')
  findByListing(@Param('listingId') listingId: string) {
    return this.reviewsService.findByListing(listingId);
  }

  // GET /reviews/experience/:experienceId — public
  @Get('experience/:experienceId')
  findByExperience(@Param('experienceId') experienceId: string) {
    return this.reviewsService.findByExperience(experienceId);
  }

  // GET /reviews/:id — public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  // DELETE /reviews/:id — authentifie
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.reviewsService.remove(id, req.user.sub);
  }
}
