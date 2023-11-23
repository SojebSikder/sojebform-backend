import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckoutDto {
  @ApiProperty()
  plan_id: number;
}
