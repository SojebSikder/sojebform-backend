import { Test, TestingModule } from '@nestjs/testing';
import { DynamicVariableService } from './dynamic-variable.service';

describe('DynamicVariableService', () => {
  let service: DynamicVariableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamicVariableService],
    }).compile();

    service = module.get<DynamicVariableService>(DynamicVariableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
