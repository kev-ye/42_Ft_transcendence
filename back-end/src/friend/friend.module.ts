import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendController } from './friend.controller';
import { FriendEntity } from './entity/friend.entity';
import { FriendService } from './friend.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ TypeOrmModule.forFeature([FriendEntity]), UserModule],
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
