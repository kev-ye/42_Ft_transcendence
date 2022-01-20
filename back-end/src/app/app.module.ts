import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendModule } from '../friend/friend.module';
import { BlockModule } from '../block/block.module';
import { ChatHistoryModule } from '../chat-history/chat-history.module';
import { LadderModule } from '../ladder/ladder.module';
import { PrivateModule } from '../private/private.module';
import { Connection } from 'typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "109.24.247.52",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "pong",
      synchronize: true,
      logging: false,
      entities: ["./dist/**/*.entity.js"]
    }),
    FriendModule,
    BlockModule,
    ChatHistoryModule,
    LadderModule,
    PrivateModule,
    AuthModule,
    
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
