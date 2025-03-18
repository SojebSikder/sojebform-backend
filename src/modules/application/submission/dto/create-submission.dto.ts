import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @ApiProperty({
    description: 'Form id',
  })
  form_id: string;

  @ApiProperty({
    description: 'Submission data',
  })
  data: any;
}
