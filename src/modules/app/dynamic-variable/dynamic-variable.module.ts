import { Module } from '@nestjs/common';
import { DynamicVariableService } from './dynamic-variable.service';
import { DynamicVariableController } from './dynamic-variable.controller';

@Module({
  controllers: [DynamicVariableController],
  providers: [DynamicVariableService],
})
export class DynamicVariableModule {}
