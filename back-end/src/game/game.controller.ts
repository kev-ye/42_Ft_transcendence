import { Controller, Post, Req } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
    constructor(private service: GameService) {}

    @Post('public')
    async createPublicGame(@Req() req: any) {
        if (!req.session || !req.session.id)
            return ;
        const userID = req.session.userId;
        return await this.service.createGameWithCreator(userID);
    }

    
}
