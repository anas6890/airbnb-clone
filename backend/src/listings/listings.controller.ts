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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ListingsService, ListingFilters } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';
import type { RequestWithUser } from '../Auth/types/request-with-user';

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

  // POST /listings/:id/photos — authentifié
  @Post(':id/photos')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadPhotos(
    @Param('id') id: string,
    @UploadedFiles() files: any[],
    @Request() req: RequestWithUser,
  ) {
    const photoUrls = files.map(file => `/public/uploads/${file.filename}`);
    return this.listingsService.addPhotos(id, photoUrls, req.user.sub);
  }

  // DELETE /listings/:id — authentifié
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.listingsService.remove(id, req.user.sub);
  }
}
