import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { SojebStorage } from '../../../common/lib/Disk/SojebStorage';
import { StripePayment } from '../../../common/lib/Payment/stripe/StripePayment';

@Injectable()
export class ContactService extends PrismaClient {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(createContactDto: CreateContactDto) {
    try {
      const data = {};
      if (createContactDto.first_name) {
        data['first_name'] = createContactDto.first_name;
      }
      if (createContactDto.last_name) {
        data['last_name'] = createContactDto.last_name;
      }
      if (createContactDto.email) {
        data['email'] = createContactDto.email;
      }
      if (createContactDto.phone_number) {
        data['phone_number'] = createContactDto.phone_number;
      }
      if (createContactDto.message) {
        data['message'] = createContactDto.message;
      }

      await this.prisma.contact.create({
        data: data,
      });

      return {
        success: true,
        message: 'Submitted successfully',
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
