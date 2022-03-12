import { Controller, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { FriendService } from './friend.service';
import { MessageBody } from '@nestjs/websockets';
import { Interval } from '@nestjs/schedule';

@Controller('friend')
export class FriendController {
  constructor(@Inject('FRIEND_SERVICE') private service: FriendService) {}

  @Post()
  async addFriend(@MessageBody() data: { first: string; second: string }) {
    console.log("adding friend", data);
    
    return await this.service.addFriend(data);
  }

  @Patch()
  async deleteFriend(@MessageBody() data: { first: number; second: number }) {
    return await this.service.deleteFriend(data);
  }

  @Get(':id')
  async getFriends(@Param('id') id: string) {
    return await this.service.getFriends(id);
  }
}
