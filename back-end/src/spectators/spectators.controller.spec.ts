import { Test, TestingModule } from '@nestjs/testing';
import { SpectatorsController } from './spectators.controller';

describe('SpectatorsController', () => {
  let controller: SpectatorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpectatorsController],
    }).compile();

    controller = module.get<SpectatorsController>(SpectatorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
