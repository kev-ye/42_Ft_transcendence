import { Injectable } from '@nestjs/common';
import { targetModulesByContainer } from '@nestjs/core/router/router-module';
import { Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { WebSocketServer } from '@nestjs/websockets';
import { stat } from 'fs';
import { report } from 'process';
import { Server } from 'socket.io';
import { PlayersService } from 'src/players/players.service';
import { clearInterval } from 'timers';
import { Repository } from 'typeorm';
import { GameEntity } from './entity/game.entity';
import { GameGateway } from './game.gateway';
export const TIME_TO_REFRESH = 200; //milliseconds
export const XSPEED_MIN = 0.1;
export const YSPEED_MIN = 0.1;

@Injectable()
export class GameService {
    constructor(@InjectRepository(GameEntity) private repo: Repository<GameEntity>,
    private playerService: PlayersService) {}

    @WebSocketServer()
    server: Server;

    games: Map<string, any> = new Map<string, any>();

    async startGame(gameID: string) {
        //wait 3 seconds to star
        setTimeout(() => { }, 3);

        let game = await this.getGameById(gameID);
        if (!game)
            return ;
        let stats = {
            first: 0, //position of first player
            second: 0, //position of second player
            speed: this.generateRandomSpeed(), //ball's speed
            pos: { //ball's position
                x: 0,
                y: 0
            },
            power: 0, //todo: implement powerups
            score: {first: 0, second: 0}

        };
            
        const tmp = setInterval(() => {
            stats.pos.x += stats.speed.x;
            stats.pos.y += stats.speed.y;

            if (stats.pos.x == -50)
            {
                stats.speed = this.generateRandomSpeed();
                stats.second++;
                if (stats.score.second >= game.limit_game)
                {
                    this.playerWins(game.second);
                    this.playerLoses(game.first);
                }
            }
            else if (stats.pos.x == 50)
            {
                stats.speed = this.generateRandomSpeed();
                stats.first++;
                if (stats.score.first >= game.limit_game)
                {
                    this.playerWins(game.first);
                    this.playerLoses(game.second);
                }
            }
        }, TIME_TO_REFRESH);
    }

    generateRandomSpeed(): { x: number; y: number; } {
        let x = Math.random() - 0.5;
        let y = Math.random() - 0.5;
        
        if (Math.abs(x) < XSPEED_MIN)
            x = x < 0 ? -XSPEED_MIN : XSPEED_MIN;
        if (Math.abs(y) < YSPEED_MIN)
            x = x < 0 ? -YSPEED_MIN : YSPEED_MIN;
        return {x: x, y: y};
    }

    async setPlayerState(socketID: string, value: number) {
        const tmp = await this.repo.findOne({where: [{first: socketID}, {second: socketID}]});
        if (!tmp)
            return null;
        if (tmp.first == socketID)
        {
            await this.repo.update({id: tmp.id}, {second_state: value}); //set ready
            this.games.set(tmp.id, {...this.games.get(tmp.id), first_state: value});
        }
        else
        {
            await this.repo.update({id: tmp.id}, {second_state: value});
            this.games.set(tmp.id, {...this.games.get(tmp.id), second_state: value});
        }
        return tmp;
    }

    async getGameById(id: string) {
        return await this.repo.findOne({id: id});
    }

    async createGame(): Promise<GameEntity> {
        const tmp = this.repo.create();
        this.games.set(tmp.id, tmp);
        return await this.repo.save(tmp);
    }

    async createGameWithCreator(userID: string) {
        const tmp = this.repo.create({creator_id: userID});
        return await this.repo.save(tmp);
    } 

    async deleteGameById(id: string) {
        return await this.repo.delete({id: id});
    }

    async joinGame(socketID: string, gameID: string) {
        const tmp = await this.repo.findOne({id: gameID});
        if (tmp)
        {
            if (!tmp.first)
            {
                tmp.first = socketID;
                this.games.set(tmp.id, {...this.games.get(tmp.id), first: socketID});
            }
            else if (!tmp.second)
            {
                
                tmp.second = socketID;
                this.games.set(tmp.id, {...this.games.get(tmp.id), second: socketID});
                this.startGame(tmp.id);
            }
            else
                return false;
            await this.repo.update({id: tmp.id}, tmp);
            return true;
        }
        return false;
    }

    async playerLoses(socketID: string) {

    }

    async playerWins(socketID: string) {

    }

    async handleDisconnect(socketID: string) {
        const player = await this.playerService.getPlayerBySocketId(socketID);
        if (!player || !player.game_id)
            return ;
        const game = await this.repo.findOne({id: player.game_id});
        if (game)
        {
            if (game.game_state == 1 && (game.first == socketID || game.second == socketID))
            {
                if (game.first == socketID)
                {
                    this.playerLoses(game.first);
                    this.playerWins(game.second);
                } else
                {
                    this.playerWins(game.first);
                    this.playerLoses(game.second);
                }
            }
        }
    }

    async forfeitGame(socketID: string, gameID: string) {

    }

    async stopGame(gameID: string) {
        const tmp = await this.repo.findOne({id: gameID});
        if (tmp) {
            await this.repo.update(tmp.id, {...this.games.get(tmp.id), status: 2});
            this.games.delete(tmp.id);
            const players = await this.playerService.getPlayersInGame(tmp.id);
            players.forEach(val => {
                this.playerService.updatePlayer({id: val.id}, {status: 0, game_id: null});
            });
        }
        return false;
    }
}
