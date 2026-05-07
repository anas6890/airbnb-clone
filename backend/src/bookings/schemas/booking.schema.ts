import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema({ _id: false })
class PriceSnapshot {
  @Prop({ required: true }) pricePerNight: number;
  @Prop({ required: true }) nights: number;
  @Prop({ required: true }) subtotal: number;
  @Prop({ default: 0 }) cleaningFee: number;
  @Prop({ default: 0 }) serviceFee: number;
  @Prop({ required: true }) total: number;
}

@Schema({ _id: false })
class GuestSnapshot {
  @Prop({ required: true }) name: string;
  @Prop({ default: '' }) avatar: string;
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: true })
  checkIn: Date;

  @Prop({ required: true })
  checkOut: Date;

  @Prop({
    default: 'pending',
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
  })
  status: string;

  @Prop({ type: PriceSnapshot, required: true })
  priceSnapshot: PriceSnapshot;

  @Prop({ type: GuestSnapshot, required: true })
  guestSnapshot: GuestSnapshot;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  guestId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Listing', required: true })
  listingId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Payment', default: null })
  paymentId: Types.ObjectId | null;

  @Prop({ required: true, min: 1 })
  guests: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
