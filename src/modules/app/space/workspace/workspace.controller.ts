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
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { HasPlanGuard } from '../../../../common/guard/has-plan/has-plan.guard';
import { AbilitiesGuard } from '../../../../providers/ability/abilities.guard';
import { CheckAbilities } from '../../../../providers/ability/abilities.decorator';
import { Action } from '../../../../providers/ability/ability.factory';

@ApiBearerAuth()
@ApiTags('workspace')
@UseGuards(JwtAuthGuard, AbilitiesGuard, HasPlanGuard)
@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @ApiOperation({ summary: 'Create new workspace' })
  @CheckAbilities({ action: Action.Create, subject: 'Workspace' })
  @Post()
  async create(@Req() req, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    const userId = req.user.userId;

    const workspace = await this.workspaceService.create(
      userId,
      createWorkspaceDto,
    );
    if (workspace) {
      return {
        success: false,
        message: 'Workspace created successfully',
      };
    } else {
      return {
        success: false,
        message: 'Workspace not created',
      };
    }
  }

  @ApiOperation({ summary: 'Find all workspaces' })
  @CheckAbilities({ action: Action.Read, subject: 'Workspace' })
  @Get()
  async findAll(@Req() req) {
    const userId = req.user.userId;
    const workspaces = await this.workspaceService.findAll(userId);

    return {
      data: workspaces,
    };
  }

  @ApiOperation({ summary: 'Find one workspace' })
  @CheckAbilities({ action: Action.Show, subject: 'Workspace' })
  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string) {
    const userId = req.user.userId;
    const workspace = await this.workspaceService.findOne(+id, userId);
    if (workspace) {
      return {
        data: workspace,
      };
    } else {
      return {
        success: false,
        message: 'Workspace not exist',
      };
    }
  }

  @ApiOperation({ summary: 'Update workspace' })
  @CheckAbilities({ action: Action.Update, subject: 'Workspace' })
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    const userId = req.user.userId;
    const workspace = await this.workspaceService.update(
      +id,
      userId,
      updateWorkspaceDto,
    );

    if (workspace) {
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

  @ApiOperation({ summary: 'Delete workspace' })
  @CheckAbilities({ action: Action.Delete, subject: 'Workspace' })
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const userId = req.user.userId;
    const workspace = await this.workspaceService.remove(+id, userId);

    if (workspace) {
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
