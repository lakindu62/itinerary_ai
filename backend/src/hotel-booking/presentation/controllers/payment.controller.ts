import { Controller, Post, Body, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Stripe } from 'stripe';
import { ClerkAuthGuard } from 'src/shared/guards/clerk-auth-guard';
import { Request } from 'express';

@Controller('payments')
export class PaymentController {
  private stripe: Stripe;

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20' as any,
    });
  }

  @UseGuards(ClerkAuthGuard)
  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body() body: { amount: number },
    @Req() req: Request,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: body.amount,
      currency: 'usd',
    });

    return { clientSecret: paymentIntent.client_secret };
  }
}
