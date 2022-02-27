import { Injectable } from '@nestjs/common';
import { targetModulesByContainer } from '@nestjs/core/router/router-module';
import { Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { WebSocketServer } from '@nestjs/websockets';
import { report } from 'process';
import { Server } from 'socket.io';
import { Repository } from 'typeorm';
import { GameEntity } from './entity/game.entity';

@Injectable()
export class GameService {
    constructor(@InjectRepository(GameEntity) private repo: Repository<GameEntity>) {}

    @WebSocketServer()
    server: Server;

    async setPlayerState(socketID: string, value: number) {
        const tmp = await this.repo.findOne({where: [{first: socketID}, {second: socketID}]});
        if (!tmp)
            return null;
        if (tmp.first == socketID)
            tmp.first_state = value; //set ready
        else
            tmp.second_state = value;
        await this.repo.update({id: tmp.id}, tmp);
        return tmp;
    }

    async getGameById(id: string) {
        return await this.repo.findOne({id: id});
    }

    async createGame(): Promise<GameEntity> {
        const tmp = this.repo.create();
        return await this.repo.save(tmp);
    }

    async createGameWithCreator(userID: string) {
        const tmp = this.repo.create({creator_id: userID});
        return await this.repo.save(tmp);
    } 

    async deleteGameById(id: string) {
        return await this.repo.delete({id: id});
    }

    async joinGame(userID: string, gameID: string) {
        const tmp = await this.repo.findOne({id: gameID});
        if (tmp)
        {
            if (!tmp.first)
                tmp.first = userID;
            else if (!tmp.second)
                tmp.second = userID;
            else
                return false;
            await this.repo.update({id: tmp.id}, tmp);
            return true;
        }
        return false;
    }

    async leaveGame(userID: string, gameID: string) {
        const tmp = await this.repo.findOne({id: gameID});
        if (tmp) {
            if (tmp.first == userID)
            {
                tmp.first = tmp.second;
                tmp.second = null;
            }
            else if (tmp.second == userID)
                tmp.second = null;
            else
                return true;
            await this.repo.update({id: tmp.id}, tmp);

            return true;
        }
        return false;
    }
}
