import {
  Controller,
  Get,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from '../../../../ability/abilities.guard';
import { HasPlanGuard } from '../../../../common/guard/has-plan/has-plan.guard';
import { JwtAuthGuard } from '../../../../modules/auth/guards/jwt-auth.guard';
import { CheckAbilities } from '../../../../ability/abilities.decorator';
import { Action } from '../../../../ability/ability.factory';

@ApiBearerAuth()
@ApiTags('submission')
@UseGuards(JwtAuthGuard, AbilitiesGuard, HasPlanGuard)
@Controller('admin/space/:workspace_id/submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @ApiOperation({ summary: 'Find all submission' })
  @CheckAbilities({ action: Action.Read, subject: 'Submission' })
  @Get()
  async findAll(@Req() req: Request, @Query() query: { form_id: string }) {
    try {
      const user_id = req.user.userId;
      const workspace_id = req.params.workspace_id;

      const submissions = await this.submissionService.findAll({
        form_id: query.form_id,
        user_id: user_id,
        workspace_id: workspace_id,
      });

      return submissions;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: 'Find one submission' })
  @CheckAbilities({ action: Action.Show, subject: 'Submission' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const submission = await this.submissionService.findOne(id);
      return submission;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: 'Delete submission' })
  @CheckAbilities({ action: Action.Delete, subject: 'Submission' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const submission = await this.submissionService.remove(id);
      return submission;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
