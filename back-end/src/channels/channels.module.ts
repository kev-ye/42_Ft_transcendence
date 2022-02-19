import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanModule } from 'src/ban/ban.module';
import { ChatHistoryModule } from 'src/chat-history/chat-history.module';
import { ModeratorModule } from 'src/moderator/moderator.module';
import { MuteModule } from 'src/mute/mute.module';
import { PrivateInviteModule } from 'src/private-invite/private-invite.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { ChannelEntity } from './entity/channels.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelEntity]),
    ModeratorModule,
    BanModule,
    MuteModule,
    PrivateInviteModule,
    UserModule
  ],
  controllers: [ChannelsController],
  providers: [{
    provide: 'CHANNELS_SERVICE',
    useClass: ChannelsService
  }],
  exports: [{
    provide: 'CHANNELS_SERVICE',
    useClass: ChannelsService
  }]
})
export class ChannelsModule {}
