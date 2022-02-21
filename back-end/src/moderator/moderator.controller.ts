import { Controller, Delete, Get, Logger, Param, Patch, Post, Req } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { ModeratorService } from './moderator.service';

@Controller('moderator')
export class ModeratorController {
    constructor(private service: ModeratorService) {}

    @Get(':chatID')
    async getModerators(@Param('chatID') chatID: string) {
        return this.service.getModeratorsByChatID(chatID);
    }

    @Post()
    async createModerator(@MessageBody() data: any, @Req() req: any) {
        const userID = req.session.userId;

        return await this.service.createModerator(userID, data);
    }

    @Patch()
    async deleteModerator(@MessageBody() data: any, @Req() req: any) {
        const userID = req.session.userId;
        Logger.log("Trying delete moderator")


        return await this.service.deleteModerator(userID, data);
    }

    @Patch('all')
    async deleteAllModerators(@MessageBody() data: any, @Req() req: any) {
        const userID = req.session.userId;

        return await this.service.deleteAllModerator(data);
    }
}
