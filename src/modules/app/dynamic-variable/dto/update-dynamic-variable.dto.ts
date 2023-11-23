import { PartialType } from '@nestjs/swagger';
import { CreateDynamicVariableDto } from './create-dynamic-variable.dto';

export class UpdateDynamicVariableDto extends PartialType(CreateDynamicVariableDto) {}
