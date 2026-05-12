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
import { ExperiencesService, ExperienceFilters } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';
import type { RequestWithUser } from '../Auth/types/request-with-user';

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  // POST /experiences — authentifie
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateExperienceDto, @Request() req: RequestWithUser) {
    return this.experiencesService.create(dto, req.user.sub);
  }

  // GET /experiences — public
  @Get()
  findAll(
    @Query('city') city?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    const filters: ExperienceFilters = {
      city,
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    };
    return this.experiencesService.findAll(filters);
  }

  // GET /experiences/:id — public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experiencesService.findOne(id);
  }

  // PUT /experiences/:id — authentifie
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateExperienceDto>,
    @Request() req: RequestWithUser,
  ) {
    return this.experiencesService.update(id, dto, req.user.sub);
  }

  // DELETE /experiences/:id — authentifie
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.experiencesService.remove(id, req.user.sub);
  }
}
