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

  async create(createFormDto: CreateFormDto) {
    try {
      return this.prisma.form.create({
        data: {
          title: createFormDto.title,
          description: createFormDto.description,
          fields: {
            create: JSON.parse(createFormDto.fields),
          },
        },
      });
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async findAll() {
    try {
      const forms = await this.prisma.form.findMany({
        include: {
          fields: true,
        },
      });
      return {
        success: true,
        data: forms,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async findOne(id: string) {
    try {
      const form = await this.prisma.form.findUnique({
        where: { id },
      });
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

  async update(id: string, updateFormDto: UpdateFormDto) {
    try {
      const form = await this.prisma.form.update({
        where: { id },
        data: {
          title: updateFormDto.title,
          description: updateFormDto.description,
          fields: {
            update: JSON.parse(updateFormDto.fields),
          },
        },
      });
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

  async remove(id: string) {
    try {
      await this.prisma.form.delete({
        where: { id },
      });
      return {
        success: true,
        message: 'Form deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
