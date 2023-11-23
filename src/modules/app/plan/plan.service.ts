import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlanService extends PrismaClient {
  constructor(private prisma: PrismaService) {
    super();
  }

  create(createPlanDto: CreatePlanDto) {
    return 'This action adds a new plan';
  }

  async findAll() {
    const plans = await this.prisma.plan.findMany({
      where: {
        status: 1,
      },
      select: {
        id: true,
        name: true,
        price_per_month: true,
        gateway_price_id: true,
      },
    });

    return plans;
  }

  findOne(id: number) {
    return `This action returns a #${id} plan`;
  }

  update(id: number, updatePlanDto: UpdatePlanDto) {
    return `This action updates a #${id} plan`;
  }

  remove(id: number) {
    return `This action removes a #${id} plan`;
  }
}
