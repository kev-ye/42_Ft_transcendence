import { Controller, Get, Inject, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { UserGuard } from '../auth/user.guard';
import { UserService } from '../user/user.service'
import e, { Response } from 'express';
import { MessageBody } from '@nestjs/websockets';
import { PlayersService } from 'src/players/players.service';

@Controller('game')
export class GameController {
    constructor(private service: GameService,
        @Inject('USER_SERVICE') private userService: UserService,
        private playerService: PlayersService) {}
        
        @Get()
        async getGames() {
            return await this.service.getAllGames();
        }

        @Post('custom')
        @UseGuards(UserGuard)
        async createCustomGame(@Req() req: any, @Res() res: Response, @MessageBody() data: {limit_game?: number, power?: number}) {
            const userID = req.session.userId;
            
            if (!(await this.userService.getUserById(userID)))
            {
                res.status(403).send();
                return ;
            }
            const player = await this.playerService.getPlayerByUserId(userID);
            if (!player || player.find(val => val.game_id))
            {
                res.status(403).send();
                return ;
            }
            const games = [...(await this.service.getGameByStatus(0)), ...(await this.service.getGameByStatus(1))];
            if (games.length >= 1)
            {
                let id: string = '';
                let error: boolean = false;
                games.forEach(val => {
                    if (val.creator_id == userID)
                        {
                            error = true;
                            id = val.id;
                        }
                    return ;
                });
                if (error)
                {
                    res.status(403).send({id: id});
                    return ;
                }
            }
            let obj: any = {};
            
            if (data.limit_game)
                obj.limit_game = +data.limit_game;
            if (data.power != undefined)
                obj.power = +data.power;
            const newGame = (await this.service.createGameWithCreator(userID, obj));
            res.send({id: newGame.id});
            setTimeout(async () => {
                const tmp = await this.service.getGameById(newGame.id);
                if (tmp.first == null)
                    this.service.deleteGameById(newGame.id);
            }, 5000);
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
    