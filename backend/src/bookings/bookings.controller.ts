import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { RequestWithUser } from '../auth/types/request-with-user';

@Controller('bookings')
@UseGuards(JwtAuthGuard) // toutes les routes nécessitent un JWT
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // POST /bookings
  @Post()
  create(@Body() dto: CreateBookingDto, @Request() req: RequestWithUser) {
    return this.bookingsService.create(dto, req.user.sub);
  }

  // GET /bookings
  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  // GET /bookings/me
  @Get('me')
  findMyBookings(@Request() req: RequestWithUser) {
    return this.bookingsService.findMyBookings(req.user.sub);
  }

  // GET /bookings/:id
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.bookingsService.findOne(id, req.user.sub);
  }

  // PATCH /bookings/:id/status
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req: RequestWithUser,
  ) {
    return this.bookingsService.updateStatus(id, status, req.user.sub);
  }
}
