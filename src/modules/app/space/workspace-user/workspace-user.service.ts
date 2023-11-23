import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../../../../common/repository/user/user.repository';
import { PrismaService } from '../../../../providers/prisma/prisma.service';
import { CreateWorkspaceUserDto } from './dto/create-workspace-user.dto';
import { UpdateWorkspaceUserDto } from './dto/update-workspace-user.dto';

@Injectable()
export class WorkspaceUserService extends PrismaClient {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(
    user_id: number,
    workspace_id: number,
    createWorkspaceUserDto: CreateWorkspaceUserDto,
  ) {
    workspace_id = Number(workspace_id);
    const tenant_id = await UserRepository.getTenantId(user_id);
    const invited_user_id = Number(createWorkspaceUserDto.user_id);

    const workspaceUser = await this.prisma.workspaceUser.create({
      data: {
        user_id: invited_user_id,
        tenant_id: tenant_id,
        workspace_id: workspace_id,
      },
    });
    return workspaceUser;
  }

  async findAll(user_id: number, workspace_id: number) {
    workspace_id = Number(workspace_id);
    const tenant_id = await UserRepository.getTenantId(user_id);

    const workspaceUsers = this.prisma.workspaceUser.findMany({
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            fname: true,
            lname: true,
            email: true,
            tenant_id: true,
          },
        },
      },
      where: {
        AND: [
          {
            workspace_id: workspace_id,
          },
          {
            tenant_id: tenant_id,
          },
        ],
      },
    });
    return workspaceUsers;
  }

  findOne(id: number) {
    return `This action returns a #${id} workspaceUser`;
  }

  update(id: number, updateWorkspaceUserDto: UpdateWorkspaceUserDto) {
    return `This action updates a #${id} workspaceUser`;
  }

  async remove(id: number, user_id: number, workspace_id: number) {
    const tenant_id = await UserRepository.getTenantId(user_id);

    const workspaceUser = await this.prisma.workspaceUser.deleteMany({
      where: {
        user_id: id,
        workspace_id: workspace_id,
        tenant_id: tenant_id,
      },
    });
    return workspaceUser;
  }
}
