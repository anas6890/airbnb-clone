import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ListingsService, ListingFilters } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { RequestWithUser } from '../auth/types/request-with-user';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  // POST /listings — authentifié
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateListingDto, @Request() req: RequestWithUser) {
    return this.listingsService.create(dto, req.user.sub);
  }

  // GET /listings — public
  @Get()
  findAll(
    @Query('city') city?: string,
    @Query('type') type?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('guests') guests?: string,
  ) {
    const filters: ListingFilters = {
      city,
      type,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      guests: guests ? Number(guests) : undefined,
    };
    return this.listingsService.findAll(filters);
  }

  // GET /listings/:id — public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  // PUT /listings/:id — authentifié
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateListingDto>,
    @Request() req: RequestWithUser,
  ) {
    return this.listingsService.update(id, dto, req.user.sub);
  }

  // DELETE /listings/:id — authentifié
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.listingsService.remove(id, req.user.sub);
  }
}
