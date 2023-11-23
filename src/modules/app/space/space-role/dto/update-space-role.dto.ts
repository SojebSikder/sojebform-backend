import { PartialType } from '@nestjs/swagger';
import { CreateSpaceRoleDto } from './create-space-role.dto';

export class UpdateSpaceRoleDto extends PartialType(CreateSpaceRoleDto) {}
