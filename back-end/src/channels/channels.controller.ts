import { Controller, Delete, Get, Inject, Param, Patch, Post, Put, Req, Res } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { Response } from 'express';
import { ChannelsService } from './channels.service';

@Controller('channels')
export class ChannelsController {
    constructor(@Inject('CHANNELS_SERVICE') private service: ChannelsService) {}
    //@Inject('CHAT_HISTORY_SERVICE') private historyService: ChatHistoryService) {}

    @Get('access/:chatID')
    async checkAccess(@Req() req: any, @MessageBody() data: any, @Param('chatID') chatID: string) {
        
        const userID = req.session.userId;
        console.log("check access", userID, data);
        if (!userID)
            return false;
        return await this.service.checkAccess(userID, chatID);
    }

    @Get()
    async getChannels(@Req() req: any) {
        const userID = req.session.userId;

        return await this.service.getAll(userID);
    }

    @Post('password/:chatID')
    async checkPassword(@Param('chatID') chatID: string, @MessageBody() data: any) {
        return await this.service.checkPassword(data.password, chatID);
    }

    @Post('ban')
    async banUser(@Req() req: any, @MessageBody() data: any) {
        const userID = req.session.userId;

        return await this.service.banUser(userID, data);
    }

    @Post('mute')
    async createMute(@MessageBody() data: any, @Req() req: any) {
        console.log("test", data);
        
        let date = new Date();
        const userID = req.session.userId;
        
        let tmp: number = +data.seconds;
        tmp += date.getSeconds();
        date.setSeconds(tmp)        


        return await this.service.createMute(userID, {user_id: data.user_id, chat_id: data.chat_id, date: date}); 
    }

    @Post('moderator')
    async createModerator(@MessageBody() data: any, @Req() req: any) {
        const userID = req.session.userId;

        return await this.service.createModerator(userID, data);
    }

    @Patch('moderator')
    async deleteModerator(@MessageBody() data: any, @Req() req: any) {
        const userID = req.session.userId;

        return await this.service.deleteModerator(userID, data);
    }

    @Post('invite/name')
    async inviteToChannel(@MessageBody() data: any, @Req() req: any) {
        const userID = req.session.userId;
        return await this.service.inviteToChannelByName(userID, data.name, data)
        
    }


    @Post()
    async createChannel(@MessageBody() data: any, @Req() req: any, @Res() res: Response) {
        const userID = req.session.userId;

        if (await this.service.getChannelByName(data.name))
        {
            res.status(403).send();
            return;
        }

        await this.service.createChannel(userID, data);
        res.status(201).send();
    }

    @Put()
    async updateChannel(@MessageBody() data: any, @Req() req: any) {
        const userID = req.session.userId;

        return await this.service.updateById(userID, data);
    }

    @Delete()
    async deleteChannel(@MessageBody() data: any) {
        //check if user is owner

        //this.historyService.deleteByChatID(data.chat_id);
    }
}