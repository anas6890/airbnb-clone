import * as common from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';
import type { RequestWithUser } from '../Auth/types/request-with-user';

@common.Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // POST /payments/webhook — Stripe envoie les événements ici (pas de JWT)
  @common.Post('webhook')
  webhook(
    @common.Headers('stripe-signature') signature: string,
    @common.Req() req: common.RawBodyRequest<any>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.paymentsService.handleWebhook(signature, req.rawBody as Buffer);
  }

  // POST /payments — authentifié
  @common.Post()
  @common.UseGuards(JwtAuthGuard)
  create(
    @common.Body() dto: CreatePaymentDto,
    @common.Req() req: RequestWithUser,
  ) {
    return this.paymentsService.create(dto, req.user.sub);
  }

  // GET /payments/booking/:bookingId — authentifié
  @common.Get('booking/:bookingId')
  @common.UseGuards(JwtAuthGuard)
  findByBooking(
    @common.Param('bookingId') bookingId: string,
    @common.Req() req: RequestWithUser,
  ) {
    return this.paymentsService.findByBooking(bookingId, req.user.sub);
  }

  // GET /payments/:id — authentifié
  @common.Get(':id')
  @common.UseGuards(JwtAuthGuard)
  findOne(@common.Param('id') id: string, @common.Req() req: RequestWithUser) {
    return this.paymentsService.findOne(id, req.user.sub);
  }

  // PATCH /payments/:id/status — authentifié
  @common.Patch(':id/status')
  @common.UseGuards(JwtAuthGuard)
  updateStatus(
    @common.Param('id') id: string,
    @common.Body('status') status: string,
    @common.Req() req: RequestWithUser,
    @common.Body('stripePaymentIntentId') stripePaymentIntentId?: string,
  ) {
    return this.paymentsService.updateStatus(
      id,
      status,
      req.user.sub,
      stripePaymentIntentId,
    );
  }
}
