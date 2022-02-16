import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BanEntity } from './entity/ban.entity';

@Injectable()
export class BanService {
    constructor(@InjectRepository(BanEntity) private repo: Repository<BanEntity>) {}

    async getBanByUser(userID: string) {
        return await this.repo.find({user_id: userID}); 
    }

    async checkAccess(data: any) {
        const tmp = await this.getBanByUser(data.user_id);
        if (tmp.find(val => {
            return val.chat_id == data.chat_id;
        }))
            return false;
        return true;
    }

    async banUser(data: any) {
        if (await this.repo.findOne({where: {chat_id: data.chat_id, user_id: data.user_id}}))
            return false;
        const tmp = this.repo.create(data);
        await this.repo.save(tmp);
        return true;
    }
}
