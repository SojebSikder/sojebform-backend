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
      const name = createFormDto.name;
      const description = createFormDto.description;
      const elements = createFormDto.elements;

      const form = await this.prisma.form.create({
        data: {
          name: name,
          description: description,
          elements: {
            // create: JSON.parse(createFormDto.elements),
            create: elements,
          },
        },
      });
      return {
        success: true,
        message: 'Form created successfully',
      };
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
          elements: true,
        },
        orderBy: {
          updated_at: 'desc',
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
        select: {
          id: true,
          name: true,
          description: true,
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

  async update(id: string, updateFormDto: UpdateFormDto) {
    try {
      const existingForm = await this.prisma.form.findUnique({
        where: {
          id: id,
        },
      });

      if (!existingForm) {
        return {
          success: false,
          message: 'Form not found',
        };
      }

      const form = await this.prisma.form.update({
        where: { id },
        data: {
          name: updateFormDto.name,
          description: updateFormDto.description,
          elements: {
            // update: JSON.parse(updateFormDto.elements),
            update: updateFormDto.elements,
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

  async toggleStatus(id: string) {
    try {
      const existingForm = await this.prisma.form.findUnique({
        where: {
          id: id,
        },
      });

      if (!existingForm) {
        return {
          success: false,
          message: 'Form not found',
        };
      }

      const form = await this.prisma.form.update({
        where: { id },
        data: {
          status: existingForm.status == 1 ? 0 : 1,
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
      const existingForm = await this.prisma.form.findUnique({
        where: {
          id: id,
        },
      });

      if (!existingForm) {
        return {
          success: false,
          message: 'Form not found',
        };
      }

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
