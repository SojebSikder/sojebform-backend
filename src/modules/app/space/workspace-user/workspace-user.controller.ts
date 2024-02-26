import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WorkspaceUserService } from './workspace-user.service';
import { CreateWorkspaceUserDto } from './dto/create-workspace-user.dto';
import { UpdateWorkspaceUserDto } from './dto/update-workspace-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { AbilitiesGuard } from '../../../../providers/ability/abilities.guard';
import { CheckAbilities } from '../../../../providers/ability/abilities.decorator';
import { Action } from '../../../../providers/ability/ability.factory';
import { HasPlanGuard } from '../../../../common/guard/has-plan/has-plan.guard';

@ApiBearerAuth()
@ApiTags('workspace-user')
@UseGuards(JwtAuthGuard, AbilitiesGuard, HasPlanGuard)
@Controller('space/:workspace_id/workspace-user')
export class WorkspaceUserController {
  constructor(private readonly workspaceUserService: WorkspaceUserService) {}

  @ApiOperation({ summary: 'Create workspace user' })
  @CheckAbilities({ action: Action.Create, subject: 'WorkspaceUser' })
  @Post()
  async create(
    @Req() req,
    @Body() createWorkspaceUserDto: CreateWorkspaceUserDto,
  ) {
    const user_id = req.user.userId;
    const workspace_id = req.params.workspace_id;

    const workspaceUser = await this.workspaceUserService.create(
      user_id,
      workspace_id,
      createWorkspaceUserDto,
    );
    if (workspaceUser) {
      return {
        success: false,
        message: 'User added successfully',
      };
    } else {
      return {
        success: false,
        message: 'User not added',
      };
    }
  }

  @ApiOperation({ summary: 'Find all workspace user' })
  @CheckAbilities({ action: Action.Read, subject: 'WorkspaceUser' })
  @Get()
  async findAll(@Req() req) {
    const workspace_id = req.params.workspace_id;
    const user_id = req.user.userId;

    const workspaceUsers = await this.workspaceUserService.findAll(
      user_id,
      workspace_id,
    );

    if (workspaceUsers) {
      return { data: workspaceUsers };
    } else {
      return { data: [] };
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workspaceUserService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkspaceUserDto: UpdateWorkspaceUserDto,
  ) {
    return this.workspaceUserService.update(+id, updateWorkspaceUserDto);
  }

  @ApiOperation({ summary: 'Remove workspace user' })
  @CheckAbilities({ action: Action.Delete, subject: 'WorkspaceUser' })
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const user_id = req.user.userId;
    const workspace_id = req.params.workspace_id;

    const workspaceUser = await this.workspaceUserService.remove(
      +id,
      user_id,
      workspace_id,
    );

    if (workspaceUser) {
      return {
        success: false,
        message: 'User invitation sent successfully',
      };
    } else {
      return {
        success: false,
        message: 'User not created',
      };
    }
  }
}
