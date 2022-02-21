import { Controller, Get, Headers, Inject, Param, Post } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { ChannelsService } from 'src/channels/channels.service';
import { UserService } from 'src/user/user.service';
import { ChatHistoryService } from './chat-history.service';

@Controller('history')
export class ChatHistoryController {
    constructor(@Inject('CHAT_HISTORY_SERVICE') private service: ChatHistoryService,
    @Inject('USER_SERVICE') private user: UserService) {}//,
    //@Inject('CHANNELS_SERVICE') private chanService: ChannelsService) {}


    @Get(':id')
    async getChatHistory(@Param('id') id: string, @Headers() headers: any) {
        //const tmp = await this.chanService.getChannelById(id);

        /*
        if (!tmp)
            return false;
        if (tmp.access == 1)
        {
            if (!headers['password'])
                return false;
            if (!this.chanService.checkPassword(headers['password'], id))
                return false;
        }
        */
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
    async postMessage(@Param('id') id: string, @MessageBody() data: any, @Headers() headers: any) {
        /*const tmp = await this.chanService.getChannelById(id);
        if (!tmp)
            return false;
        if (tmp.access == 1)
        {
            if (!headers['password'])
                return false;
            if (!this.chanService.checkPassword(headers['password'], id))
                return false;
        }*/

        this.service.create(data);
    }

}
