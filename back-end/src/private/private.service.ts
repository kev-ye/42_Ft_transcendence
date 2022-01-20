import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Private } from './private.entity';

@Injectable()
export class PrivateService {
    constructor(@InjectRepository(Private) private repo: Repository<Private>) {}

    async postMessage(data: {from: number, to: number, type: number, message?: string}) {
        const tmp = this.repo.create(data);
        return await this.repo.save(tmp);
    }

    async getMessages(data: {first: number, second: number}) {
        const tmp = await this.repo.find({where : [
            {from: data.first, to: data.second},
            {from: data.second, to: data.first}
        ]});
        let result = [];
        tmp.forEach(val => {
            result.push({user_id: val.from, message: val.message, type: val.type});
        });
        return result;
    }
}
