import { Test, TestingModule } from '@nestjs/testing';
import { ActiveUsersController } from './active-users.controller';

describe('ActiveUsersController', () => {
  let controller: ActiveUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActiveUsersController],
    }).compile();

    controller = module.get<ActiveUsersController>(ActiveUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
