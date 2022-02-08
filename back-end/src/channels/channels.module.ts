import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatHistoryModule } from 'src/chat-history/chat-history.module';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { ChannelEntity } from './entity/channels.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelEntity]),
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
