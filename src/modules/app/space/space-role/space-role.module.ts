import { Module } from '@nestjs/common';
import { SpaceRoleService } from './space-role.service';
import { SpaceRoleController } from './space-role.controller';

@Module({
  controllers: [SpaceRoleController],
  providers: [SpaceRoleService]
})
export class SpaceRoleModule {}
