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

  update(id: number, updateFormDto: UpdateFormDto) {
    return `This action updates a #${id} form`;
  }

  async submitForm(id: string, data: any) {
    try {
      const form = await this.prisma.form.findUnique({
        where: { id },
      });
      if (!form) {
        return {
          success: false,
          message: 'Form not found',
        };
      }
      await this.prisma.response.create({
        data: {
          form_id: form.id,
          responses: JSON.stringify(data),
        },
      });
      // const fields = form.fields;
      // const fieldData = fields.map((field) => {
      //   return {
      //     [field.name]: data[field.name],
      //   };
      // });
      // const formData = {
      //   ...form,
      //   ...fieldData,
      // };
      // const formSubmission = await this.prisma.formSubmission.create({
      //   data: formData,
      // });

      return {
        success: true,
        message: 'Form submitted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} form`;
  }
}
