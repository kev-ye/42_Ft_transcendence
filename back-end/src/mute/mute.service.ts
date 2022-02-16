import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MuteEntity } from './entity/mute.entity';

@Injectable()
export class MuteService {
    constructor(@InjectRepository(MuteEntity) private repo: Repository<MuteEntity>) {}

    async addMute(data: any) {
        const tmp = this.repo.create(data);
        return await this.repo.save(tmp);
    }

    async deleteMute(data: any) {
        return await this.repo.delete({first: data.first, second: data.second});
    }
}
