import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendController } from './friend.controller';
import { Friend } from './friend.entity';
import { FriendService } from './friend.service';

@Module({
  imports: [ TypeOrmModule.forFeature([Friend])],
  controllers: [FriendController],
  providers: [
    {
      provide: 'FRIEND_SERVICE',
      useClass: FriendService
    }
  ],
  exports: [
    {
      provide: 'FRIEND_SERVICE',
      useClass: FriendService
    }
  ]
  
})
export class FriendModule {}
