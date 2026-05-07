import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ _id: false })
class PriceBreakdown {
  @Prop({ required: true }) subtotal: number;
  @Prop({ default: 0 }) cleaningFee: number;
  @Prop({ default: 0 }) serviceFee: number;
  @Prop({ default: 0 }) taxes: number;
  @Prop({ required: true }) total: number;
}

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ required: true, default: 'USD' })
  currency: string;

  @Prop({
    default: 'pending',
    enum: ['pending', 'captured', 'refunded', 'failed'],
  })
  status: string;

  @Prop({ default: '' })
  stripePaymentIntentId: string;

  @Prop({ type: PriceBreakdown, required: true })
  breakdown: PriceBreakdown;

  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  bookingId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
