import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from 'src/common/repository/user/user.repository';
import { PrismaService } from '../../../../providers/prisma/prisma.service';

@Injectable()
export class PermissionService extends PrismaClient {
  constructor(private prisma: PrismaService) {
    super();
  }

  async findAll(user_id: number, workspace_id: number) {
    workspace_id = Number(workspace_id);
    // const tenant_id = await UserRepository.getTenantId(user_id);
    const userDetails = await UserRepository.getUserDetails(user_id);

    // const role_id = 2; // admin role

    const role_id = userDetails.role_users[0].role_id;

    const permissions = await this.prisma.role.findFirst({
      where: {
        AND: [
          {
            id: role_id,
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
    return permissions;
  }
}
