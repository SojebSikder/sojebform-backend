import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Controller('space/:workspace_id/template/:workspace_channel_id')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  async create(@Req() req, @Body() createTemplateDto: CreateTemplateDto) {
    const workspace_id = req.params.workspace_id;
    const workspace_channel_id = req.params.workspace_channel_id;
    const user = req.user;

    const template = await this.templateService.create(
      { user_id: user.userId, workspace_id, workspace_channel_id },
      createTemplateDto,
    );

    if (template) {
      return {
        success: true,
        message: 'Template saved successfully.',
      };
    } else {
      return {
        error: true,
        message: 'Template not saved successfully.',
      };
    }
  }

  @Get()
  findAll() {
    // TODO
    // return this.templateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.templateService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return this.templateService.update(+id, updateTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.templateService.remove(+id);
  }
}
