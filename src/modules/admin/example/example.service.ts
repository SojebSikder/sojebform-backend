import { Injectable } from '@nestjs/common';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';
import { StripePayment } from '../../../common/lib/Payment/stripe/StripePayment';
import OpenAI from 'openai';
import appConfig from 'src/config/app.config';

@Injectable()
export class ExampleService {
  async testai(prompt: string) {
    try {
      const openai = new OpenAI({
        baseURL: appConfig().openai.base_url,
        apiKey: appConfig().openai.api_key,
      });
      const completion = await openai.chat.completions.create({
        model: appConfig().openai.model,
        store: true,
        messages: [{ role: 'user', content: prompt }],
      });

      const data = completion.choices[0].message.content;
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
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

  async createStripeConnectedAccount(email: string) {
    try {
      const connectedAccount =
        await StripePayment.createConnectedAccount(email);
      return {
        success: true,
        message: 'Connected account created successfully',
        data: connectedAccount,
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

  create(createExampleDto: CreateExampleDto) {
    return 'This action adds a new example';
  }

  findAll() {
    return `This action returns all example`;
  }

  findOne(id: number) {
    return `This action returns a #${id} example`;
  }

  update(id: number, updateExampleDto: UpdateExampleDto) {
    return `This action updates a #${id} example`;
  }

  remove(id: number) {
    return `This action removes a #${id} example`;
  }
}
