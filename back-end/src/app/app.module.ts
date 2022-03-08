import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

/* Custom imports */
import { UserModule } from '../user/user.module';
import { BlockModule } from '../block/block.module';
import { FriendModule } from '../friend/friend.module';
import { ChatHistoryModule } from '../chat-history/chat-history.module';
import { LadderModule } from '../ladder/ladder.module';
import { PrivateModule } from '../private/private.module';
import { ChannelsModule } from 'src/channels/channels.module';
import { ImageModule } from 'src/image/image.module';
import { AuthModule } from 'src/auth/auth.module';
import { ActiveUsersModule } from 'src/active-users/active-users.module';
import { BanModule } from 'src/ban/ban.module';
import { ChatGatewayModule } from 'src/chat-gateway/chat-gateway.module';
import { MuteModule } from 'src/mute/mute.module';
import { ModeratorModule } from 'src/moderator/moderator.module';
import { GameGateway } from 'src/game/game.gateway';
import { PlayersModule } from 'src/players/players.module';
import { GameModule } from 'src/game/game.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: true, // don't use in production
      // entities: ['./dist/**/*.entity.js'],
    }),
    UserModule,
    FriendModule,
    BlockModule,
    ChatHistoryModule,
    LadderModule,
    PrivateModule,
    ChannelsModule,
    ImageModule,
    PassportModule,
    AuthModule,
    ActiveUsersModule,
    ChatGatewayModule,
    BanModule,
    BlockModule,
    MuteModule,
    ModeratorModule,
    GameModule,
    PlayersModule,
    ScheduleModule.forRoot(),
  ],
  providers: [],
})
export class AppModule {}
