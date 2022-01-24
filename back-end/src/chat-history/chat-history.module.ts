import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatHistoryController } from './chat-history.controller';
import { ChatHistoryService } from './chat-history.service';
import { ChatHistoryEntity } from './entity/chat_history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatHistoryEntity]),
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
