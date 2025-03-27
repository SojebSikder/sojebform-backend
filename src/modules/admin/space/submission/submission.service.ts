import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UserRepository } from '../../../../common/repository/user/user.repository';

@Injectable()
export class SubmissionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    form_id,
    user_id,
    workspace_id,
  }: {
    form_id: string;
    user_id: string;
    workspace_id: string;
  }) {
    try {
      const tenant_id = await UserRepository.getTenantId(user_id);
      const form = await this.prisma.form.findUnique({
        where: {
          id: form_id,
          tenant_id: tenant_id,
          workspace_id: workspace_id,
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
