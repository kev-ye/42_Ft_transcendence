import { Module } from '@nestjs/common';
import { ProfileController } from '../profile/profile.controller'

@Module({
  imports: [],
  controllers: [ ProfileController ]
})
export class AppModule {}
