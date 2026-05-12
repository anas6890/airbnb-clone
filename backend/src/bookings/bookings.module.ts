import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { Listing, ListingSchema } from '../listings/schemas/listing.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AuthModule } from '../Auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Listing.name, schema: ListingSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
