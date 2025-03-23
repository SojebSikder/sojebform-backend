import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';

@Controller('admin/form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  async create(@Body() createFormDto: CreateFormDto) {
    try {
      const form = await this.formService.create(createFormDto);
      return form;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get()
  async findAll() {
    try {
      const forms = await this.formService.findAll();
      return forms;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const form = await this.formService.findOne(id);
      return form;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    try {
      const form = await this.formService.update(id, updateFormDto);
      return form;
    } catch (error) {
      throw error;
      // return {
      //   success: false,
      //   message: error.message,
      // };
    }
  }

  @Patch(':id/status')
  async toggleStatus(@Param('id') id: string) {
    try {
      const form = await this.formService.toggleStatus(id);
      return form;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const form = await this.formService.remove(id);
      return form;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
