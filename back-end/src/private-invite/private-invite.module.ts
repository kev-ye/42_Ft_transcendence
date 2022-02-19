import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivateInviteEntity } from './entity/private-invite.entity';
import { PrivateInviteController } from './private-invite.controller';
import { PrivateInviteService } from './private-invite.service';

@Module({
  imports: [TypeOrmModule.forFeature([PrivateInviteEntity])],
  controllers: [PrivateInviteController],
  providers: [PrivateInviteService],
  exports: [PrivateInviteService]
})
export class PrivateInviteModule {}
