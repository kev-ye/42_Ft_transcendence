import { Controller, Get, Inject, Post } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { ChatGateway } from 'src/chat-gateway/chat.gateway';
import { BanService } from './ban.service';

@Controller()
export class BanController {
    constructor(@Inject('BAN_SERVICE') private service: BanService, @Inject('CHAT_GATEWAY') private gateway: ChatGateway) {}

    @Post('ban')
    async banUser(@MessageBody() data: any) {
        //check if user is moderator
        console.log("received for ban :", data);
        
        if (this.service.banUser(data))
            return await this.gateway.banUser(data);
    }

    @Post('access')
    async checkAccess(@MessageBody() data: any) {
        return await this.service.checkAccess(data);
    }


}
