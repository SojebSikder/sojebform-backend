import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';

import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('create-stripe-customer')
  async createStripeCustomer(@Body() body: { email: string }) {
    const result = await this.appService.createStripeCustomer(body.email);
    return result;
  }

  @Post('create-onboarding-link')
  async createOnboardingLink(@Body() body: { account_id: string }) {
    const result = await this.appService.createOnBordingLink(body.account_id);
    return result;
  }

  @Post('create-payout')
  async createPayout(
    @Body() body: { account_id: string; amount: number; currency: string },
  ) {
    try {
      const result = await this.appService.createPayout(
        body.account_id,
        body.amount,
        body.currency,
      );
      return result;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
