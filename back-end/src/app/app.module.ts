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
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
	TypeOrmModule.forRoot({
		type: 'postgres',
		host: 'localhost',
		port: 5432,
		username: 'yek',
		password: '',
		database: 'test',
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
		PrivateModule,
    PassportModule,
    AuthModule
	]
})
export class AppModule {}
