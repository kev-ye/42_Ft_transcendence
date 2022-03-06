import { Controller, Get, Inject, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { UserGuard } from '../auth/user.guard';
import { UserService } from '../user/user.service'
import e, { Response } from 'express';
import { MessageBody } from '@nestjs/websockets';

@Controller('game')
export class GameController {
    constructor(private service: GameService,
        @Inject('USER_SERVICE') private userService: UserService) {}
        
        @Post('custom')
        @UseGuards(UserGuard)
        async createCustomGame(@Req() req: any, @Res() res: Response, @MessageBody() data: {limit_game?: number}) {
            const userID = req.session.userId;
            
            if (!(await this.userService.getUserById(userID)))
            {
                res.status(403).send();
                return ;
            }
            const games = [...(await this.service.getGameByStatus(0)), ...(await this.service.getGameByStatus(1))];
            if (games.length >= 1)
            {
                let error: boolean = false;
                games.forEach(val => {
                    if (val.creator_id == userID)
                        error = true;
                    return ;
                });
                if (error)
                {
                    res.status(403).send();
                    return ;
                }
            }
            if (data.limit_game)
            {
                res.send({id: (await this.service.createGameWithCreator(userID, {limit_game: data.limit_game})).id})
                return;
            }
            res.send({id: (await this.service.createGameWithCreator(userID)).id});
            return ;
        }

        @Get('custom/:id')
        async getCustomGameById(@Param('id') id: string) {
            const tmp = await this.service.getGameById(id);
            if (tmp && tmp.creator_id)
                return tmp;
            return null;
        }
    }
    