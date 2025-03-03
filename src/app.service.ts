import { Injectable } from '@nestjs/common';
import { SojebStorage } from './common/lib/Disk/SojebStorage';
import { StripePayment } from './common/lib/Payment/stripe/StripePayment';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello world';
  }

  async createStripeCustomer(email: string) {
    try {
      const customer = await StripePayment.createCustomer({
        user_id: '1',
        name: 'John Doe',
        email: email,
      });
      return {
        success: true,
        message: 'Customer created successfully',
        data: customer,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async createOnBordingLink(account_id: string) {
    try {
      const link = await StripePayment.createOnboardingAccountLink(account_id);
      return {
        success: true,
        message: 'Onboarding link created successfully',
        data: link,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async createPayout(account_id: string, amount: number, currency: string) {
    try {
      const payout = await StripePayment.createPayout(
        account_id,
        amount,
        currency,
      );
      return {
        success: true,
        message: 'Payout created successfully',
        data: payout,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
