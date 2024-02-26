import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { PrismaService } from '../../../providers/prisma/prisma.service';

@Injectable()
export class FormService extends PrismaClient {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(userId: number, createFormDto: CreateFormDto) {
    const { title, description } = createFormDto;

    const form = await this.prisma.form.create({
      data: {
        title,
        description,
        user_id: userId,
      },
    });

    if (form) {
      return {
        success: false,
        message: 'Form has been created successfully',
      };
    } else {
      return {
        success: false,
        message: 'Form could not be created',
      };
    }
  }

  findAll() {
    return `This action returns all form`;
  }

  findOne(id: number) {
    return `This action returns a #${id} form`;
  }

  update(id: number, updateFormDto: UpdateFormDto) {
    return `This action updates a #${id} form`;
  }

  remove(id: number) {
    return `This action removes a #${id} form`;
  }
}
