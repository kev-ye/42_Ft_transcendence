import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendModule } from './friend/friend.module';
import { ProfileController } from './profile/profile.controller'
import { BlockModule } from './block/block.module';
import { ChatHistoryModule } from './chat-history/chat-history.module';
import { LadderModule } from './ladder/ladder.module';

@Module({
  imports: [
    FriendModule,
    TypeOrmModule.forRoot(),
    BlockModule,
    ChatHistoryModule,
    LadderModule
  ],
  controllers: [ ProfileController ]
})
export class AppModule {}
