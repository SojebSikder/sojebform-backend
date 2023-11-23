import { ApiProperty } from '@nestjs/swagger';

export class CreateBillingDto {
  @ApiProperty()
  customer: string;
}
