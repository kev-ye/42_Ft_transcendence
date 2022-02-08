import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { Connection } from 'typeorm';
import { PassportModule } from '@nestjs/passport';

/* Custom imports */
import { UserModule } from '../user/user.module';
import { BlockModule } from '../block/block.module';
import { FriendModule } from '../friend/friend.module';
import { ChatHistoryModule } from '../chat-history/chat-history.module';
import { LadderModule } from '../ladder/ladder.module';
import { PrivateModule } from '../private/private.module';
import { ChannelsModule } from 'src/channels/channels.module';
import { ChatGateway } from 'src/gateways/chat.gateway';
import { ImageModule } from 'src/image/image.module';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [
	TypeOrmModule.forRoot({
		type: 'postgres',
		host: 'localhost',
		port: 5432,
		username: 'postgres',
		password: 'poinsinet',
		database: 'test',
		synchronize: true,
		// logging: false,
		 dropSchema: false, // don't use in prod
		entities: [ "./dist/**/*.entity.js" ]
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
	
	],
	providers: [
		ChatGateway
	]
})
export class AppModule {
	constructor(private connection: Connection) {}
}
