import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../../providers/prisma/prisma.service';

@Injectable()
export class CountryService extends PrismaClient {
  constructor(private prisma: PrismaService) {
    super();
  }

  async findAll() {
    const countries = await this.prisma.country.findMany();
    return countries;
  }
}
