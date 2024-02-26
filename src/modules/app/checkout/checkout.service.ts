import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { StripeMethod } from 'src/common/lib/Payment/stripe/Stripe';
import { UserRepository } from 'src/common/repository/user/user.repository';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';

@Injectable()
export class CheckoutService extends PrismaClient {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(userId, createCheckoutDto: CreateCheckoutDto) {
    const plan = await this.prisma.plan.findFirst({
      where: {
        id: createCheckoutDto.plan_id,
      },
    });

    if (plan) {
      const userDetails = await UserRepository.getUserDetails(userId);
      let billing_id = userDetails.billing_id;
      if (!userDetails.billing_id) {
        // create new customer on stripe
        const customer = await StripeMethod.addNewCustomer({
          user_id: userDetails.id,
          email: userDetails.email,
          name: `${userDetails.fname} ${userDetails.lname}`,
        });

        if (customer) {
          const user = await this.prisma.user.update({
            where: {
              id: userDetails.id,
            },
            data: {
              billing_id: customer.id,
            },
          });

          if (user) {
            billing_id = user.billing_id;

            const checkout =
              await StripeMethod.createSubscriptionCheckoutSession(
                billing_id,
                plan.gateway_price_id,
              );

            return { data: checkout.url };
          }
        }
      } else {
        const checkout = await StripeMethod.createSubscriptionCheckoutSession(
          billing_id,
          plan.gateway_price_id,
        );

        return { data: checkout.url };
      }
    } else {
      return {
        success: false,
        message: 'Plan not found',
      };
    }
  }

  findAll() {
    return `This action returns all checkout`;
  }

  findOne(id: number) {
    return `This action returns a #${id} checkout`;
  }

  update(id: number, updateCheckoutDto: UpdateCheckoutDto) {
    return `This action updates a #${id} checkout`;
  }

  remove(id: number) {
    return `This action removes a #${id} checkout`;
  }
}
