import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  async create(@Body() createSubmissionDto: CreateSubmissionDto) {
    try {
      const submission =
        await this.submissionService.create(createSubmissionDto);

      return submission;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get()
  findAll() {
    return this.submissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    return this.submissionService.update(+id, updateSubmissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submissionService.remove(+id);
  }
}
