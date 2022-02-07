import { Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { UserService } from 'src/user/user.service';
import { ChatHistoryService } from './chat-history.service';

@Controller('history')
export class ChatHistoryController {
    constructor(@Inject('CHAT_HISTORY_SERVICE') private service: ChatHistoryService,
    @Inject('USER_SERVICE') private user: UserService) {}


    @Get(':id')
    async getChatHistory(@Param('id') id: number) {
        
        const result = await this.service.showChat(id);
        let lastResult: any[] = [];

        for (const val of result)
        {
            const tmp = await this.user.getUserById(val.user_id);
            if (tmp)
                lastResult.push({...val, username: tmp.name});
        }
        
        return lastResult;
    }

    @Post(':id')
    async postMessage(@Param('id') id: number, @MessageBody() data: any) {
        this.service.create(data);
    }

}
