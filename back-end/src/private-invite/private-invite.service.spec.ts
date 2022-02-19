import { Test, TestingModule } from '@nestjs/testing';
import { PrivateInviteService } from './private-invite.service';

describe('PrivateInviteService', () => {
  let service: PrivateInviteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrivateInviteService],
    }).compile();

    service = module.get<PrivateInviteService>(PrivateInviteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
