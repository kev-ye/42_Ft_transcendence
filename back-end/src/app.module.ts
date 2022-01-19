import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendModule } from './friend/friend.module';
import { ProfileController } from './profile/profile.controller'

@Module({
  imports: [
    FriendModule,
    TypeOrmModule.forRoot()
  ],
  controllers: [ ProfileController ]
})
export class AppModule {}
