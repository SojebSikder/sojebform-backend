import { Injectable } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UserRepository } from '../../../../common/repository/user/user.repository';

@Injectable()
export class FormService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    user_id: string,
    workspace_id: string,
    createFormDto: CreateFormDto,
  ) {
    try {
      if (!workspace_id) {
        return {
          success: false,
          message: 'workspace_id is require',
        };
      }

      const name = createFormDto.name;
      const description = createFormDto.description;
      const elements = createFormDto.elements;

      const tenant_id = await UserRepository.getTenantId(user_id);

      const data = {};
      if (name) {
        data['name'] = name;
      }
      if (description) {
        data['description'] = description;
      }

      await this.prisma.form.create({
        data: {
          ...data,
          workspace_id: workspace_id,
          tenant_id: tenant_id,
          elements: {
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

  async findAll(user_id: string, workspace_id: string) {
    try {
      const tenant_id = await UserRepository.getTenantId(user_id);
      const forms = await this.prisma.form.findMany({
        where: {
          workspace_id: workspace_id,
          tenant_id: tenant_id,
        },
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

  async findOne(id: string, user_id: string, workspace_id: string) {
    try {
      const tenant_id = await UserRepository.getTenantId(user_id);
      const form = await this.prisma.form.findUnique({
        where: {
          id: id,
          workspace_id: workspace_id,
          tenant_id: tenant_id,
        },
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

  async update(
    id: string,
    updateFormDto: UpdateFormDto,
    user_id: string,
    workspace_id: string,
  ) {
    try {
      const tenant_id = await UserRepository.getTenantId(user_id);
      const existingForm = await this.prisma.form.findUnique({
        where: {
          id: id,
          workspace_id: workspace_id,
          tenant_id: tenant_id,
        },
      });

      if (!existingForm) {
        return {
          success: false,
          message: 'Form not found',
        };
      }

      const name = updateFormDto.name;
      const description = updateFormDto.description;
      const elements = updateFormDto.elements;

      const data = {};
      if (name) {
        data['name'] = name;
      }
      if (description) {
        data['description'] = description;
      }

      const updatedElements = [];

      elements.forEach((element) => {
        if (element.id) {
          updatedElements.push({
            where: {
              id: element.id,
            },
            update: {
              type: element.type,
              extra_attributes: element.extra_attributes,
            },
            create: {
              type: element.type,
              extra_attributes: element.extra_attributes,
            },
          });
        } else {
          updatedElements.push(element);
        }
      });

      const form = await this.prisma.form.update({
        where: { id },
        data: {
          ...data,
          elements: {
            upsert: updatedElements,
          },
        },
      });

      return {
        success: true,
        message: 'Form updated successfully',
        data: form,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async toggleStatus(id: string, user_id: string, workspace_id: string) {
    try {
      const tenant_id = await UserRepository.getTenantId(user_id);
      const existingForm = await this.prisma.form.findUnique({
        where: {
          id: id,
          workspace_id: workspace_id,
          tenant_id: tenant_id,
        },
      });

      if (!existingForm) {
        return {
          success: false,
          message: 'Form not found',
        };
      }

      const form = await this.prisma.form.update({
        where: {
          id: id,
          workspace_id: workspace_id,
          tenant_id: tenant_id,
        },
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

  async remove(id: string, user_id: string, workspace_id: string) {
    try {
      const tenant_id = await UserRepository.getTenantId(user_id);
      const existingForm = await this.prisma.form.findUnique({
        where: {
          id: id,
          workspace_id: workspace_id,
          tenant_id: tenant_id,
        },
      });

      if (!existingForm) {
        return {
          success: false,
          message: 'Form not found',
        };
      }

      await this.prisma.form.delete({
        where: {
          id: id,
          workspace_id: workspace_id,
          tenant_id: tenant_id,
        },
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
