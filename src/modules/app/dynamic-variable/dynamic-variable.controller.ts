import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DynamicVariableService } from './dynamic-variable.service';
import { CreateDynamicVariableDto } from './dto/create-dynamic-variable.dto';
import { UpdateDynamicVariableDto } from './dto/update-dynamic-variable.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HasPlanGuard } from '../../../common/guard/has-plan/has-plan.guard';
import { AbilitiesGuard } from '../../../providers/ability/abilities.guard';
import { CheckAbilities } from '../../../providers/ability/abilities.decorator';
import { Action } from '../../../providers/ability/ability.factory';

@ApiBearerAuth()
@ApiTags('dynamic-variable')
@UseGuards(JwtAuthGuard, AbilitiesGuard, HasPlanGuard)
@Controller('dynamic-variable')
export class DynamicVariableController {
  constructor(
    private readonly dynamicVariableService: DynamicVariableService,
  ) {}

  @Post()
  create(@Body() createDynamicVariableDto: CreateDynamicVariableDto) {
    return this.dynamicVariableService.create(createDynamicVariableDto);
  }

  @ApiOperation({ summary: 'Read dynamic-variable' })
  @CheckAbilities({ action: Action.Read, subject: 'WorkspaceConversation' })
  @Get()
  findAll() {
    const dynamicVariables = this.dynamicVariableService.findAll();

    return {
      data: dynamicVariables,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dynamicVariableService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDynamicVariableDto: UpdateDynamicVariableDto,
  ) {
    return this.dynamicVariableService.update(+id, updateDynamicVariableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dynamicVariableService.remove(+id);
  }
}
