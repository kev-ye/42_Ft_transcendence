import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { Connection } from 'typeorm';

/* Custom imports */
import { UserModule } from '../user/user.module';
import { BlockModule } from '../block/block.module';
import { FriendModule } from '../friend/friend.module';
import { ChatHistoryModule } from '../chat-history/chat-history.module';
import { LadderModule } from '../ladder/ladder.module';
import { PrivateModule } from '../private/private.module';


@Module({
  imports: [
	TypeOrmModule.forRoot({
		type: 'postgres',
		host: 'localhost',
		port: 5432,
		username: 'yek',
		password: '',
		database: '',
		synchronize: true,
		// logging: false,
		dropSchema: true, // don't use in production
		entities: [ "./dist/**/*.entity.js" ]
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
