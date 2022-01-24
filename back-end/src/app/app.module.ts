import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

/* Custom imports */
import { UserModule } from '../user/user.module';
import { BlockModule } from '../block/block.module';
import { FriendModule } from '../friend/friend.module';
import { ChatHistoryModule } from 'src/chat-history/chat-history.module';
import { LadderModule } from '../ladder/ladder.module';
import { PrivateModule } from '../private/private.module';



@Module({
  imports: [
	TypeOrmModule.forRoot({
		type: 'postgres',
		host: 'localhost',
		port: 5432,
		username: 'postgres',
		password: 'postgres',
		database: 'test',
		synchronize: true,
		// logging: false,
		// dropSchema: false, // don't use in prod
		entities: [ "./dist/**/*.entity.js" ]
		// entities: ['../entities/*.entity{.ts,.js}']
		}),
		UserModule,
    FriendModule,
    BlockModule,
    ChatHistoryModule,
    LadderModule,
    PrivateModule
	]
})
export class AppModule {
	constructor(private connection: Connection) {}
}