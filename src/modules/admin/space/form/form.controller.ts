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
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../modules/auth/guards/jwt-auth.guard';
import { AbilitiesGuard } from '../../../../ability/abilities.guard';
import { HasPlanGuard } from '../../../../common/guard/has-plan/has-plan.guard';
import { CheckAbilities } from '../../../../ability/abilities.decorator';
import { Action } from '../../../../ability/ability.factory';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('form')
@UseGuards(JwtAuthGuard, AbilitiesGuard, HasPlanGuard)
@Controller('admin/space/:workspace_id/form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @ApiOperation({ summary: 'Create form' })
  @CheckAbilities({ action: Action.Create, subject: 'Form' })
  @Post()
  async create(@Req() req: Request, @Body() createFormDto: CreateFormDto) {
    try {
      const user_id = req.user.userId;
      const workspace_id = req.params.workspace_id;

      const form = await this.formService.create(
        user_id,
        workspace_id,
        createFormDto,
      );
      return form;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: 'Find all form' })
  @CheckAbilities({ action: Action.Read, subject: 'Form' })
  @Get()
  async findAll(@Req() req: Request) {
    try {
      const user_id = req.user.userId;
      const workspace_id = req.params.workspace_id;
      const forms = await this.formService.findAll(user_id, workspace_id);
      return forms;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: 'Find one form' })
  @CheckAbilities({ action: Action.Show, subject: 'Form' })
  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    try {
      const user_id = req.user.userId;
      const workspace_id = req.params.workspace_id;
      const form = await this.formService.findOne(id, user_id, workspace_id);
      return form;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: 'Update form' })
  @CheckAbilities({ action: Action.Update, subject: 'Form' })
  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateFormDto: UpdateFormDto,
  ) {
    try {
      const user_id = req.user.userId;
      const workspace_id = req.params.workspace_id;
      const form = await this.formService.update(
        id,
        updateFormDto,
        user_id,
        workspace_id,
      );
      return form;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: 'Update form status' })
  @CheckAbilities({ action: Action.Update, subject: 'Form' })
  @Patch(':id/status')
  async toggleStatus(@Req() req: Request, @Param('id') id: string) {
    try {
      const user_id = req.user.userId;
      const workspace_id = req.params.workspace_id;
      const form = await this.formService.toggleStatus(
        id,
        user_id,
        workspace_id,
      );
      return form;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: 'Delete form' })
  @CheckAbilities({ action: Action.Delete, subject: 'Form' })
  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    try {
      const user_id = req.user.userId;
      const workspace_id = req.params.workspace_id;
      const form = await this.formService.remove(id, user_id, workspace_id);
      return form;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
