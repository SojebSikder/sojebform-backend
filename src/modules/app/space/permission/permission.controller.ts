import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { HasPlanGuard } from '../../../../common/guard/has-plan/has-plan.guard';
import { CheckAbilities } from '../../../../providers/ability/abilities.decorator';
import { Action } from '../../../../providers/ability/ability.factory';

@ApiBearerAuth()
@ApiTags('Permission')
@UseGuards(JwtAuthGuard, HasPlanGuard)
@Controller('space/:workspace_id/permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOperation({ summary: 'Read permissions' })
  @CheckAbilities({ action: Action.Read, subject: 'Role' })
  @Get()
  async findAll(@Req() req) {
    const user_id = req.user.userId;
    const workspace_id = req.params.workspace_id;

    const permissions = await this.permissionService.findAll(
      user_id,
      workspace_id,
    );
    if (permissions) {
      return {
        data: permissions.permission_roles,
      };
    } else {
      return {
        data: [],
      };
    }
  }
}
