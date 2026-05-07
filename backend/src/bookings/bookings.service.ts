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
    const booking = new this.bookingModel(dto);
    return booking.save();
  }

  async findAll(): Promise<BookingDocument[]> {
    return this.bookingModel
      .find()
      .populate('listing', 'title location')
      .populate('guest', 'name email');
  }

  async findByGuest(guestId: string): Promise<BookingDocument[]> {
    return this.bookingModel
      .find({ guest: guestId })
      .populate('listing', 'title location images');
  }

  async findOne(id: string): Promise<BookingDocument> {
    const booking = await this.bookingModel
      .findById(id)
      .populate('listing')
      .populate('guest', 'name email');
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
