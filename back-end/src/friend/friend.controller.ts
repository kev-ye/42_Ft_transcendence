import { Controller, Delete, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { FriendService } from './friend.service';
import { MessageBody } from '@nestjs/websockets'
import { Interval } from '@nestjs/schedule';

@Controller('friend')
export class FriendController {
    constructor(@Inject('FRIEND_SERVICE') private service: FriendService) {}

    @Post()
    async addFriend(@MessageBody() data: {first: number, second: number}) {
        return await this.service.addFriend(data);
    }

    @Patch()
    async deleteFriend(@MessageBody() data: {first: number, second: number}) {
        console.log("Deleting", data.first, data.second);
        
        return await this.service.deleteFriend(data);
    }

    @Get(':id')
    async getFriends(@Param('id') id: number) {        
        return await this.service.getFriends(id);
    }

    @Interval(1000)
    checkInterval() {
        console.log("Interval");
        
    }
}
