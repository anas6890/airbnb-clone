import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '../stripe/stripe.module';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';

const VALID_STATUSES = ['pending', 'captured', 'refunded', 'failed'];

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @Inject(STRIPE_CLIENT) private stripe: any, // Stripe instance
  ) {}

  // ─── CREATE ─────────────────────────────────────────────
  async create(dto: CreatePaymentDto, userId: string) {
    const booking = await this.bookingModel.findById(dto.bookingId);
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.guestId.toString() !== userId)
      throw new ForbiddenException('This booking does not belong to you');

    const existing = await this.paymentModel.findOne({
      bookingId: dto.bookingId,
    });
    if (existing)
      throw new BadRequestException(
        'A payment already exists for this booking',
      );

    const { total, subtotal, cleaningFee, serviceFee } = booking.priceSnapshot;
    const currency = dto.currency ?? 'USD';

    const intent = await this.stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: currency.toLowerCase(),
      metadata: { bookingId: dto.bookingId, userId },
    });

    return this.paymentModel.create({
      bookingId: dto.bookingId,
      userId,
      currency,
      amount: total,
      status: 'pending',
      stripePaymentIntentId: intent.id,
      breakdown: { subtotal, cleaningFee, serviceFee, taxes: 0, total },
    });
  }

  // ─── FIND BY BOOKING ─────────────────────────────────────
  async findByBooking(bookingId: string, userId: string) {
    const payment = await this.paymentModel
      .findOne({ bookingId })
      .populate('userId', 'firstname lastname email');

    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.userId.toString() !== userId)
      throw new ForbiddenException('Access denied');

    return payment;
  }

  // ─── FIND ONE ────────────────────────────────────────────
  async findOne(id: string, userId: string) {
    const payment = await this.paymentModel.findById(id);
    if (!payment) throw new NotFoundException('Payment not found');

    if (payment.userId.toString() !== userId)
      throw new ForbiddenException('Access denied');

    return payment;
  }

  // ─── UPDATE STATUS ───────────────────────────────────────
  async updateStatus(
    id: string,
    status: string,
    userId: string,
    stripePaymentIntentId?: string,
  ) {
    if (!VALID_STATUSES.includes(status))
      throw new BadRequestException(
        `Invalid status. Accepted values: ${VALID_STATUSES.join(', ')}`,
      );

    const payment = await this.paymentModel.findById(id);
    if (!payment) throw new NotFoundException('Payment not found');

    if (payment.userId.toString() !== userId)
      throw new ForbiddenException('Access denied');

    const update: Record<string, string> = { status };
    if (stripePaymentIntentId)
      update['stripePaymentIntentId'] = stripePaymentIntentId;

    const updated = await this.paymentModel.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (status === 'captured') {
      await this.bookingModel.findByIdAndUpdate(payment.bookingId, {
        status: 'confirmed',
        paymentId: payment._id,
      });
    }

    if (status === 'refunded') {
      await this.bookingModel.findByIdAndUpdate(payment.bookingId, {
        status: 'cancelled',
      });
    }

    return updated;
  }

  // ─── WEBHOOK ─────────────────────────────────────────────
  async handleWebhook(signature: string, rawBody: Buffer) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';

    let event: any;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch {
      throw new BadRequestException('Invalid webhook signature');
    }

    if (event.type === 'payment_intent.succeeded') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const intent = event.data.object as any;
      const payment = await this.paymentModel.findOne({
        stripePaymentIntentId: intent.id,
      });

      if (payment) {
        await this.paymentModel.findByIdAndUpdate(payment._id, {
          status: 'captured',
        });
        await this.bookingModel.findByIdAndUpdate(payment.bookingId, {
          status: 'confirmed',
          paymentId: payment._id,
        });
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const intent = event.data.object as any;
      await this.paymentModel.findOneAndUpdate(
        { stripePaymentIntentId: intent.id },
        { status: 'failed' },
      );
    }

    return { received: true };
  }
}

