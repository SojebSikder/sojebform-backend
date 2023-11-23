import { ApiProperty } from '@nestjs/swagger';

export class CreateSpaceRoleDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  permission_ids: number[];
}
