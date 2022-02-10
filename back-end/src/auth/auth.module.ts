import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './fortyTwo.strategy';
import { HttpModule } from '@nestjs/axios';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
		UserModule,
		PassportModule,
		HttpModule
	],
  providers: [
		AuthService,
		FortyTwoStrategy,
		GoogleStrategy
	]
})
export class AuthModule {}
