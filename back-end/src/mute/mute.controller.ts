import { Controller, Get, Inject, Param, Post, Req } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { MuteService } from './mute.service';

@Controller('mute')
export class MuteController {
    constructor(@Inject('MUTE_SERVICE') private service: MuteService) {}

    @Post()
    async createMute(@MessageBody() data: any, @Req() req: any) {
        let date = new Date();
        
        let tmp: number = +data.seconds;
        console.log("create mute", tmp, date.getSeconds());
        tmp += date.getSeconds();
        console.log(tmp);
        
        
        date.setSeconds(tmp)
        console.log("new mute ", date);
        


        return await this.service.addMute({user_id: data.user_id, chat_id: data.chat_id, date: date}); 
    }
 x
    @Get(':chatID/:userID')
    async getMute(@Param('chatID') chatID: string, @Param('userID') userID: string) {
        return await this.service.getMute(chatID, userID); 
    }

    
}
