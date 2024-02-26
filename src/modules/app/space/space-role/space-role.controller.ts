import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SpaceRoleService } from './space-role.service';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';
import { UpdateSpaceRoleDto } from './dto/update-space-role.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { HasPlanGuard } from '../../../../common/guard/has-plan/has-plan.guard';
import { AbilitiesGuard } from '../../../../providers/ability/abilities.guard';
import { CheckAbilities } from '../../../../providers/ability/abilities.decorator';
import { Action } from '../../../../providers/ability/ability.factory';

@ApiBearerAuth()
@ApiTags('Role')
@UseGuards(JwtAuthGuard, AbilitiesGuard, HasPlanGuard)
@Controller('space/:workspace_id/role')
export class SpaceRoleController {
  constructor(private readonly spaceRoleService: SpaceRoleService) {}

  @ApiOperation({ summary: 'Create workspace role' })
  @CheckAbilities({ action: Action.Create, subject: 'Role' })
  @Post()
  async create(@Req() req, @Body() createSpaceRoleDto: CreateSpaceRoleDto) {
    const user_id = req.user.userId;
    const workspace_id = req.params.workspace_id;

    const role = await this.spaceRoleService.create(
      user_id,
      workspace_id,
      createSpaceRoleDto,
    );
    if (role) {
      return {
        success: false,
        message: 'Role created successfully',
      };
    } else {
      return {
        success: false,
        message: 'Role not created',
      };
    }
  }

  @ApiOperation({ summary: 'Read workspace roles' })
  @CheckAbilities({ action: Action.Read, subject: 'Role' })
  @Get()
  async findAll(@Req() req) {
    const user_id = req.user.userId;
    const workspace_id = req.params.workspace_id;

    const roles = await this.spaceRoleService.findAll(user_id, workspace_id);
    return { data: roles };
  }

  @ApiOperation({ summary: 'Show one workspace role' })
  @CheckAbilities({ action: Action.Show, subject: 'Role' })
  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string) {
    const user_id = req.user.userId;
    const workspace_id = req.params.workspace_id;

    const role = await this.spaceRoleService.findOne(
      +id,
      user_id,
      workspace_id,
    );

    return { data: role };
  }

  @ApiOperation({ summary: 'Update workspace role' })
  @CheckAbilities({ action: Action.Update, subject: 'Role' })
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateSpaceRoleDto: UpdateSpaceRoleDto,
  ) {
    const user_id = req.user.userId;
    const workspace_id = req.params.workspace_id;

    const role = await this.spaceRoleService.update(
      +id,
      user_id,
      workspace_id,
      updateSpaceRoleDto,
    );
    if (role) {
      return {
        success: false,
        message: 'Updated successfully',
      };
    } else {
      return {
        success: false,
        message: 'Not updated',
      };
    }
  }

  @ApiOperation({ summary: 'Delete workspace role' })
  @CheckAbilities({ action: Action.Delete, subject: 'Role' })
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: number) {
    const user_id = req.user.userId;
    const workspace_id = req.params.workspace_id;

    const role = await this.spaceRoleService.remove(+id, user_id, workspace_id);
    if (role) {
      return {
        success: false,
        message: 'Deleted successfully',
      };
    } else {
      return {
        success: false,
        message: 'Not deleted',
      };
    }
  }
}
