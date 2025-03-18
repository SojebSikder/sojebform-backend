import { Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubmissionService extends PrismaClient {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  create(createSubmissionDto: CreateSubmissionDto) {
    return 'This action adds a new submission';
  }

  async findAll({ form_id }: { form_id: string }) {
    try {
      const form = await this.prisma.form.findUnique({
        where: {
          id: form_id,
        },
      });

      if (!form) {
        return {
          success: false,
          message: 'Form not found',
        };
      }

      // get submissions
      const submissions = await this.prisma.submission.findMany({
        where: {
          form_id: form_id,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return {
        success: true,
        data: submissions,
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
      const submission = await this.prisma.submission.findUnique({
        where: {
          id: id,
        },
        include: {
          form: true,
        },
      });

      if (!submission) {
        return {
          success: false,
          message: 'Submission not found',
        };
      }

      return {
        success: true,
        data: submission,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  update(id: number, updateSubmissionDto: UpdateSubmissionDto) {
    return `This action updates a #${id} submission`;
  }

  async remove(id: string) {
    try {
      const submission = await this.prisma.submission.findUnique({
        where: {
          id: id,
        },
        include: {
          form: true,
        },
      });

      if (!submission) {
        return {
          success: false,
          message: 'Submission not found',
        };
      }
      // delete submission
      await this.prisma.submission.delete({
        where: {
          id: id,
        },
      });
      return {
        success: true,
        message: 'Submission deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
