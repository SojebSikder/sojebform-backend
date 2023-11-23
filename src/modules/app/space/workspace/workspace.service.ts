import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../../../../common/repository/user/user.repository';
import { PrismaService } from '../../../../providers/prisma/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspaceService extends PrismaClient {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(userId: number, createWorkspaceDto: CreateWorkspaceDto) {
    const tenantId = await UserRepository.getTenantId(userId);

    const workspace = await UserRepository.createWorkspace({
      user_id: userId,
      organization_id: tenantId,
      workspace_name: createWorkspaceDto.name,
    });

    return workspace;
  }

  async findAll(userId: number) {
    const tenantId = await UserRepository.getTenantId(userId);

    const workspaces = await this.prisma.workspace.findMany({
      where: {
        tenant_id: tenantId,
      },
    });
    return workspaces;
  }

  async findOne(id: number, userId: number) {
    const tenantId = await UserRepository.getTenantId(userId);

    const workspace = await this.prisma.workspace.findFirst({
      where: {
        AND: [
          {
            id: id,
          },
          {
            tenant_id: tenantId,
          },
        ],
      },
    });
    return workspace;
  }

  async update(
    id: number,
    userId: number,
    updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    const tenantId = await UserRepository.getTenantId(userId);

    const workspace = await this.prisma.workspace.updateMany({
      where: {
        AND: [
          {
            id: id,
          },
          {
            tenant_id: tenantId,
          },
        ],
      },
      data: {
        name: updateWorkspaceDto.name,
      },
    });
    return workspace;
  }

  async remove(id: number, userId: number) {
    const tenantId = await UserRepository.getTenantId(userId);

    const workspace = await this.prisma.workspace.deleteMany({
      where: {
        AND: [
          {
            id: id,
          },
          {
            tenant_id: tenantId,
          },
        ],
      },
    });
    return workspace;
  }
}
