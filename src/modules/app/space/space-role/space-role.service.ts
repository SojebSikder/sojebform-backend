import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../../../../common/repository/user/user.repository';
import { PrismaService } from '../../../../providers/prisma/prisma.service';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';
import { UpdateSpaceRoleDto } from './dto/update-space-role.dto';

@Injectable()
export class SpaceRoleService extends PrismaClient {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(
    user_id: number,
    workspace_id: number,
    createSpaceRoleDto: CreateSpaceRoleDto,
  ) {
    workspace_id = Number(workspace_id);
    const tenant_id = await UserRepository.getTenantId(user_id);
    const title = createSpaceRoleDto.title;
    const permissions = createSpaceRoleDto.permission_ids;

    return await this.prisma.$transaction(async () => {
      // create role
      const role = await this.prisma.role.create({
        data: {
          title: title,
          workspace_id: workspace_id,
          tenant_id: tenant_id,
        },
      });

      // map role and permissions
      const rolePermissions = permissions.map((per) => {
        return {
          role_id: role.id,
          permission_id: Number(per),
        };
      });

      if (role) {
        // create role permission relationship
        await this.prisma.permissionRole.createMany({
          data: rolePermissions,
        });
      }
      return role;
    });
  }

  async findAll(user_id: number, workspace_id: number) {
    workspace_id = Number(workspace_id);
    const tenant_id = await UserRepository.getTenantId(user_id);

    const roles = await this.prisma.role.findMany({
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
    return roles;
  }

  async findOne(id: number, user_id: number, workspace_id: number) {
    workspace_id = Number(workspace_id);
    const tenant_id = await UserRepository.getTenantId(user_id);

    const roles = await this.prisma.role.findFirst({
      where: {
        AND: [
          {
            id: id,
          },
          {
            workspace_id: workspace_id,
          },
          {
            tenant_id: tenant_id,
          },
        ],
      },
      include: {
        permission_roles: {
          select: {
            permission: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });
    return roles;
  }

  async update(
    id: number,
    user_id,
    workspace_id,
    updateSpaceRoleDto: UpdateSpaceRoleDto,
  ) {
    workspace_id = Number(workspace_id);
    const tenant_id = await UserRepository.getTenantId(user_id);

    const title = updateSpaceRoleDto.title;
    const permissions = updateSpaceRoleDto.permission_ids;

    return await this.prisma.$transaction(async () => {
      const role = await this.prisma.role.updateMany({
        where: {
          AND: [
            {
              id: id,
            },
            {
              workspace_id: workspace_id,
            },
            {
              tenant_id: tenant_id,
            },
          ],
        },
        data: {
          title: title,
        },
      });
      // map role and permissions
      const rolePermissions = permissions.map((per) => {
        return {
          role_id: id,
          permission_id: Number(per),
        };
      });

      if (role) {
        // remove all permissions
        await this.prisma.permissionRole.deleteMany({
          where: {
            role_id: id,
          },
        });
        // create role permission relationship
        await this.prisma.permissionRole.createMany({
          data: rolePermissions,
        });
      }
      return role;
    });
  }

  async remove(id: number, user_id: number, workspace_id: number) {
    workspace_id = Number(workspace_id);
    const tenant_id = await UserRepository.getTenantId(user_id);

    const role = await this.prisma.role.deleteMany({
      where: {
        AND: [
          {
            id: id,
          },
          {
            workspace_id: workspace_id,
          },
          {
            tenant_id: tenant_id,
          },
        ],
      },
    });

    return role;
  }
}
