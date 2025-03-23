import { Injectable } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class FormService extends PrismaClient {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  create(createFormDto: CreateFormDto) {
    return 'This action adds a new form';
  }

  findAll() {
    return `This action returns all form`;
  }

  async findOne(id: string) {
    try {
      const form = await this.prisma.form.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          elements: true,
        },
      });

      if (!form) {
        return {
          success: false,
          message: 'Form not found',
        };
      }
      return {
        success: true,
        data: form,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  update(id: number, updateFormDto: UpdateFormDto) {
    return `This action updates a #${id} form`;
  }

  remove(id: number) {
    return `This action removes a #${id} form`;
  }
}
