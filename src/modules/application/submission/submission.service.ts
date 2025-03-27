import { Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubmissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSubmissionDto: CreateSubmissionDto) {
    try {
      const form_id = createSubmissionDto.form_id;
      const submission_data = createSubmissionDto.data;
      if (!form_id) {
        return {
          success: false,
          message: 'Form id is required',
        };
      }
      if (!submission_data) {
        return {
          success: false,
          message: 'Submission data is required',
        };
      }

      // check if form exists and published
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
      if (!form.status) {
        return {
          success: false,
          message: 'Cannot submit to an unpublished form',
        };
      }

      // create submission
      await this.prisma.submission.create({
        data: {
          form_id: form_id,
          data: submission_data,
        },
      });

      return {
        success: true,
        message: 'Submission saved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  findAll() {
    return `This action returns all submission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} submission`;
  }

  update(id: number, updateSubmissionDto: UpdateSubmissionDto) {
    return `This action updates a #${id} submission`;
  }

  remove(id: number) {
    return `This action removes a #${id} submission`;
  }
}
