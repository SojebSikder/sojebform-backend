// external imports
import { Command, CommandRunner } from 'nest-commander';
import { StringHelper } from '../common/helper/string.helper';
// internal imports
import appConfig from '../config/app.config';
import { UserRepository } from '../common/repository/user/user.repository';
import { PrismaService } from '../prisma/prisma.service';

@Command({ name: 'seed', description: 'prisma db seed' })
export class SeedCommand extends CommandRunner {
  constructor(private readonly prisma: PrismaService) {
    super();
  }
  async run(passedParam: string[]): Promise<void> {
    await this.seed(passedParam);
  }

  async seed(param: string[]) {
    try {
      console.log(`Prisma Env: ${process.env.PRISMA_ENV}`);
      console.log('Seeding started...');

      // begin transaaction
      await this.prisma.$transaction(async ($tx) => {
        await this.roleSeed();
        await this.permissionSeed();
        await this.userSeed();
        await this.permissionRoleSeed();
        // subscription and plan seed
        await this.planSeed();
      });

      console.log('Seeding done.');
    } catch (error) {
      throw error;
    }
  }

  //---- subscription plan section ----
  async planSeed() {
    // system admin, user id: 1
    await this.prisma.plan.createMany({
      data: [
        {
          name: 'Team',
          plan_price_id: 'price_1MEvhxJ1sD6uaGBLDQ2DqVEK',
          price_per_month: 10,
        },
        {
          name: 'Business',
          plan_price_id: 'price_1MEviEJ1sD6uaGBLIbqAWP2Z',
          price_per_month: 30,
        },
      ],
    });
  }

  //---- user section ----
  async userSeed() {
    // system admin, user id: 1
    const systemUser = await UserRepository.createSuAdminUser({
      username: appConfig().defaultUser.system.username,
      email: appConfig().defaultUser.system.email,
      password: appConfig().defaultUser.system.password,
    });

    await this.prisma.roleUser.create({
      data: {
        user_id: systemUser.id,
        role_id: '1',
      },
    });
  }

  async permissionSeed() {
    let i = 0;
    const permissions = [];
    const permissionGroups = [
      // (system level) super admin level permission
      { title: 'organization', subject: 'Organization' },
      { title: 'tenant', subject: 'Tenant' },
      // end (system level )super admin level permission
      // Workspace
      { title: 'workspace', subject: 'Workspace' },
      { title: 'workspace_user', subject: 'WorkspaceUser' },
      // { title: 'workspace_team', subject: 'WorkspaceTeam' },
      { title: 'workspace_form', subject: 'WorkspaceForm' },
      {
        title: 'workspace_broadcast',
        subject: 'WorkspaceBroadcast',
      },
      {
        title: 'workspace_workflow',
        subject: 'WorkspaceWorkflow',
      },
      {
        title: 'workspace_report',
        subject: 'WorkspaceReport',
        scope: ['read', 'show'],
      },
      {
        title: 'workspace_data_backup',
        subject: 'WorkspaceDataBackup',
        scope: ['read', 'create'],
      },
      { title: 'user', subject: 'User' },
      { title: 'role', subject: 'Role' },
      // Project
      { title: 'Project', subject: 'Project' },
      // Task
      {
        title: 'Task',
        subject: 'Task',
        scope: ['read', 'create', 'update', 'show', 'delete', 'assign'],
      },
    ];

    for (const permissionGroup of permissionGroups) {
      if (permissionGroup['scope']) {
        for (const permission of permissionGroup['scope']) {
          permissions.push({
            id: String(++i),
            title: permissionGroup.title + '_' + permission,
            action: StringHelper.cfirst(permission),
            subject: permissionGroup.subject,
          });
        }
      } else {
        for (const permission of [
          'read',
          'create',
          'update',
          'show',
          'delete',
        ]) {
          permissions.push({
            id: String(++i),
            title: permissionGroup.title + '_' + permission,
            action: StringHelper.cfirst(permission),
            subject: permissionGroup.subject,
          });
        }
      }
    }

    await this.prisma.permission.createMany({
      data: permissions,
    });
  }

  async permissionRoleSeed() {
    const all_permissions = await this.prisma.permission.findMany();
    // const su_admin_permissions = all_permissions.filter(function (permission) {
    //   return permission.title.substring(0, 13) == 'system_tenant_';
    // });
    const su_admin_permissions = all_permissions;

    // -----su admin permission---
    const adminPermissionRoleArray = [];
    for (const su_admin_permission of su_admin_permissions) {
      adminPermissionRoleArray.push({
        role_id: '1',
        permission_id: su_admin_permission.id,
      });
    }
    await this.prisma.permissionRole.createMany({
      data: adminPermissionRoleArray,
    });
    // -----------

    // ---admin---
    const project_admin_permissions = all_permissions.filter(
      function (permission) {
        return permission.title.substring(0, 13) != 'system_tenant_';
      },
    );

    const projectAdminPermissionRoleArray = [];
    for (const admin_permission of project_admin_permissions) {
      projectAdminPermissionRoleArray.push({
        role_id: '2',
        permission_id: admin_permission.id,
      });
    }
    await this.prisma.permissionRole.createMany({
      data: projectAdminPermissionRoleArray,
    });
    // -----------

    // ---member---
    const member_permissions = all_permissions.filter(function (permission) {
      return (
        permission.title == 'form_read' ||
        permission.title == 'form_create' ||
        permission.title == 'form_update' ||
        permission.title == 'form_show' ||
        permission.title == 'form_delete'
      );
    });

    const memberPermissionRoleArray = [];
    for (const project_manager_permission of member_permissions) {
      memberPermissionRoleArray.push({
        role_id: '4',
        permission_id: project_manager_permission.id,
      });
    }
    await this.prisma.permissionRole.createMany({
      data: memberPermissionRoleArray,
    });
    // -----------
  }

  async roleSeed() {
    await this.prisma.role.createMany({
      data: [
        // system role
        {
          id: '1',
          title: 'Super Admin', // system admin, do not assign to a tenant/user
          name: 'su_admin',
        },
        // organization role
        {
          id: '2',
          title: 'Admin',
          name: 'admin',
        },
        {
          id: '3',
          title: 'Member',
          name: 'member',
        },
      ],
    });
  }
}
