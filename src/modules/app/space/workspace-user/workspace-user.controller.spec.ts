import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceUserController } from './workspace-user.controller';
import { WorkspaceUserService } from './workspace-user.service';

describe('WorkspaceUserController', () => {
  let controller: WorkspaceUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspaceUserController],
      providers: [WorkspaceUserService],
    }).compile();

    controller = module.get<WorkspaceUserController>(WorkspaceUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
