import { Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';
import { ChannelsService } from './channels.service';

@Controller('channels')
export class ChannelsController {
    constructor(@Inject('CHANNELS_SERVICE') private service: ChannelsService) {}
    //@Inject('CHAT_HISTORY_SERVICE') private historyService: ChatHistoryService) {}

    @Get()
    async getChannels() {
        return await this.service.getAll();
    }

    @Post('password/:chatID')
    async checkPassword(@Param('chatID') chatID: string, @MessageBody() data: any) {
        console.log("debut");
        
        return await this.service.checkPassword(data.password, chatID);
    }

    @Post()
    async createChannel(@MessageBody() data: any) {
        return await this.service.createChannel(data);
    }

    @Put()
    async updateChannel(@MessageBody() data: any) {
        return await this.service.updateById(data);
    }

    @Delete()
    async deleteChannel(@MessageBody() data: any) {
        //check if user is owner

        //this.historyService.deleteByChatID(data.chat_id);
    }
}
