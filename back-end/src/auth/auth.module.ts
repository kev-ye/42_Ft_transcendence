import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FortyTwoStrategy } from 'src/strategy/fortyTwo.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AuthService, FortyTwoStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
