import { Test, TestingModule } from '@nestjs/testing';
import { PrivateInviteController } from './private-invite.controller';

describe('PrivateInviteController', () => {
  let controller: PrivateInviteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivateInviteController],
    }).compile();

    controller = module.get<PrivateInviteController>(PrivateInviteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
