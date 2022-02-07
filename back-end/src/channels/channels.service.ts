import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelEntity } from './entity/channels.entity';

@Injectable()
export class ChannelsService {
    constructor(@InjectRepository(ChannelEntity) private repo: Repository<ChannelEntity>) {}

    async getAll() {
        let tmp = await this.repo.find();
        tmp.map(data => {
            data['moderator'] = true;
        });
        console.log("tesst ", tmp);
        return tmp;
        
    }

    async createChannel(data: any) {
        const result = this.repo.create(data);

        this.repo.save(result);
    }
}
