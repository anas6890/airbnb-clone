import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  async create(dto: CreateBookingDto): Promise<BookingDocument> {
    const booking = new this.bookingModel({
      checkIn: dto.checkIn,
      checkOut: dto.checkOut,
      guestId: dto.guestId,
      listingId: dto.listingId,
      guests: dto.guests,
      status: 'pending',
      priceSnapshot: {
        pricePerNight: 0,
        nights: 1,
        subtotal: dto.totalPrice,
        cleaningFee: 0,
        serviceFee: 0,
        total: dto.totalPrice,
      },
      guestSnapshot: {
        name: 'Guest User',
        avatar: '',
      },
    });
    return booking.save();
  }

  async findAll(): Promise<BookingDocument[]> {
    return this.bookingModel
      .find()
      .populate('listingId', 'title location')
      .populate('guestId', 'name email');
  }

  async findByGuest(guestId: string): Promise<BookingDocument[]> {
    return this.bookingModel
      .find({ guestId })
      .populate('listingId', 'title location images');
  }

  async findOne(id: string): Promise<BookingDocument> {
    const booking = await this.bookingModel
      .findById(id)
      .populate('listingId')
      .populate('guestId', 'name email');
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async updateStatus(id: string, status: string): Promise<BookingDocument> {
    const booking = await this.bookingModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }
}
