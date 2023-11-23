import { Test, TestingModule } from '@nestjs/testing';
import { SpaceRoleController } from './space-role.controller';
import { SpaceRoleService } from './space-role.service';

describe('SpaceRoleController', () => {
  let controller: SpaceRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpaceRoleController],
      providers: [SpaceRoleService],
    }).compile();

    controller = module.get<SpaceRoleController>(SpaceRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
