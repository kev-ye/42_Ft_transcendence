import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsModule } from 'src/channels/channels.module';
import { UserModule } from 'src/user/user.module';
import { ChatHistoryController } from './chat-history.controller';
import { ChatHistoryService } from './chat-history.service';
import { ChatHistoryEntity } from './entity/chat_history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatHistoryEntity]),
    UserModule,
    ChannelsModule
  ],
  controllers: [ChatHistoryController],
  providers: [
    {
      provide: 'CHAT_HISTORY_SERVICE',
      useClass: ChatHistoryService
    }
  ],
  exports: [
    {
      provide: 'CHAT_HISTORY_SERVICE',
      useClass: ChatHistoryService
    }
  ]
})
export class ChatHistoryModule {}
