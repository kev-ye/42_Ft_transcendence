import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Block } from './block.entity';


@Injectable()
export class BlockService {
    constructor(@InjectRepository(Block) private repo: Repository<Block>) {}

    async blockUser(data: {first: number, second: number}) {
        if (await this.repo.findOne({
            where: [
                {first: data.first, second: data.second},
            ]
        }))
        {
            console.error("Trying to block twice a user");
            return ;
        }
        const tmp = this.repo.create({first: data.first, second: data.second});
        return await this.repo.save(tmp);
    }

    async unblockUser(data: {first: number, second: number}) {
        const tmp = await this.repo.findOne({
            where: [
                {first: data.first, second: data.second},
            ]
        });

        if (!tmp)
        {
            console.error("trying to unblock a non-blocked user");
            return ;
        }
        return await this.repo.remove(tmp);
    }


    //return list of IDs of blocked users by 'id'
    async getList(id: number) {
        const tmp = await this.repo.find({
            where: [
                {first: id},
            ]
        });
        
        let result = [];
        tmp.forEach(data => {
            result.push(data.second);
        })
        return result;
    }
}
