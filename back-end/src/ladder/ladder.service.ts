import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ladder } from './ladder.entity';
import { Repository } from 'typeorm';
export const INITIAL_POINTS = 500;
export const POINTS_WINNING = 10;
export const POINTS_LOSING = 10;

@Injectable()
export class LadderService {
    constructor(@InjectRepository(Ladder) private ladderRepo: Repository<Ladder>) {}

    async getPointsFromUser(user_id: string) {
        return await this.ladderRepo.find({id: user_id})
    }

    async createLadderUser(id: string) {
        if (await this.ladderRepo.findOne({id: id}))
            return false; //User is already registered in ladder table
        const tmp = this.ladderRepo.create({id: id, points: INITIAL_POINTS, gamesPlayed: 0});
        await this.ladderRepo.save(tmp);
        return true;
    }

    async getLadder() {
        let users = await this.ladderRepo.find();
        users.forEach(async v => {
            //todo: use userService to identify each IDs with the associated username
        })
        return users;
    }

    async UserWins(id: string) {
        let tmp = await this.ladderRepo.findOne({id: id});
        if (!tmp)
            return false; //Can't find user in ladder table
        tmp.gamesPlayed++;
        tmp.points += POINTS_WINNING;
        console.log(id + " wins : " + tmp.points + " points");
        
        await this.ladderRepo.update({id: id}, {gamesPlayed: tmp.gamesPlayed, points: tmp.points});
    }

    async UserLoses(id: string) {
        let tmp = await this.ladderRepo.findOne({id: id});
        if (!tmp)
            return false; //Can't find user in ladder table
        tmp.gamesPlayed++;
        tmp.points -= POINTS_LOSING;
        if (tmp.points < 0)
            tmp.points = 0;
        console.log(id + " loses : " + tmp.points + " points");
        await this.ladderRepo.update({id: id}, {gamesPlayed: tmp.gamesPlayed, points: tmp.points});
    }
}
