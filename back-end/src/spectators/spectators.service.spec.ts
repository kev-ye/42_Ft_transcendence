import { Test, TestingModule } from '@nestjs/testing';
import { SpectatorsService } from './spectators.service';

describe('SpectatorsService', () => {
  let service: SpectatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpectatorsService],
    }).compile();

    service = module.get<SpectatorsService>(SpectatorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
