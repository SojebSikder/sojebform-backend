import { ApiProperty } from '@nestjs/swagger';
import {
  MessageTemplateComponent,
  TemplateCategory,
} from 'src/common/lib/whatsapp/client/options';

export class CreateTemplateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  category: TemplateCategory;

  @ApiProperty()
  components: MessageTemplateComponent[];

  @ApiProperty()
  language: string;
}
