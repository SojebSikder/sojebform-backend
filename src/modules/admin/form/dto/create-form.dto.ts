import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFormDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Form title',
    example: 'Machine learning Seminar',
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Form description',
    example: 'Machine learning Seminar',
  })
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Form elements',
    example: '{"name": "text", "label": "Name", "required": true}',
  })
  elements: any;
}
