import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async create(dto: CreatePaymentDto): Promise<PaymentDocument> {
    const payment = new this.paymentModel(dto);
    return payment.save();
  }

  async findByBooking(bookingId: string): Promise<PaymentDocument | null> {
    return this.paymentModel
      .findOne({ bookingId })
      .populate('userId', 'name email');
  }

  async findOne(id: string): Promise<PaymentDocument> {
    const payment = await this.paymentModel.findById(id);
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async updateStatus(
    id: string,
    status: string,
    stripePaymentIntentId?: string,
  ): Promise<PaymentDocument> {
    const update: Partial<Payment> = { status };
    if (stripePaymentIntentId) {
      (update as any).stripePaymentIntentId = stripePaymentIntentId;
    }
    const payment = await this.paymentModel.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }
}
