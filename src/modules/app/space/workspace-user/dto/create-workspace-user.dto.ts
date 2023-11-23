import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkspaceUserDto {
  @ApiProperty()
  user_id: number;
}
