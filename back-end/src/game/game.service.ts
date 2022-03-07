import { Injectable, OnModuleInit } from '@nestjs/common';
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
export class GameService implements OnModuleInit {
    constructor(@InjectRepository(GameEntity) private repo: Repository<GameEntity>,
    private playerService: PlayersService) {}

    onModuleInit() {
        this.repo.clear();
    }

    @WebSocketServer()
    server: Server;

    games: Map<string, any> = new Map<string, any>();

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

    async startGame(gameID: string) {
        await this.repo.update({id: gameID}, {game_state: 1});
    }

    async getGameById(id: string) {
        const tmp = await this.repo.find();
        for (let it of tmp)
        {
            if (it.id == id)
                return it;
        }
        return null;
    }

    async getGameByCreator(creator_id: string) {
        return await this.repo.find({creator_id: creator_id});
    }

    async getGameByStatus(status: number) {
        return await this.repo.find({game_state: status});
    }

    async createGame(): Promise<GameEntity> {
        const tmp = this.repo.create();
        this.games.set(tmp.id, tmp);
        return await this.repo.save(tmp);
    }

    async createGameWithCreator(userID: string, data?: any) {
        let tmp;
        if (data)
            tmp = this.repo.create({creator_id: userID, ...data});
        else
        tmp = this.repo.create({creator_id: userID});
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
                //this.startGame(tmp.id);
            }
            else
                return false;
            await this.playerService.updatePlayer({socket_id: socketID}, {game_id: gameID});
            await this.repo.update({id: tmp.id}, tmp);
            return true;
        }
        return false;
    }

    async handleDisconnect(socketID: string) {
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