import { Module } from '@nestjs/common';
import { WorkspaceUserService } from './workspace-user.service';
import { WorkspaceUserController } from './workspace-user.controller';

@Module({
  controllers: [WorkspaceUserController],
  providers: [WorkspaceUserService],
})
export class WorkspaceUserModule {}
