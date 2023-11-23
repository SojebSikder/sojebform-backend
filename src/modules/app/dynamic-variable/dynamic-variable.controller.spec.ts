import { Test, TestingModule } from '@nestjs/testing';
import { DynamicVariableController } from './dynamic-variable.controller';
import { DynamicVariableService } from './dynamic-variable.service';

describe('DynamicVariableController', () => {
  let controller: DynamicVariableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DynamicVariableController],
      providers: [DynamicVariableService],
    }).compile();

    controller = module.get<DynamicVariableController>(
      DynamicVariableController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
