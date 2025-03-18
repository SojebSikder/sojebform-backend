import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { Request } from 'express';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  async create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionService.create(createSubmissionDto);
  }

  @Get()
  async findAll(@Req() req: Request, @Query() query: { form_id: string }) {
    try {
      const submissions = await this.submissionService.findAll({
        form_id: query.form_id,
      });

      return submissions;
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
      const submission = await this.submissionService.findOne(id);
      return submission;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    return this.submissionService.update(+id, updateSubmissionDto);
  }

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
