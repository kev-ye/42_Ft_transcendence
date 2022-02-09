import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { activeUserEntity } from './entity/activeUsers.entity';

@Injectable()
export class ActiveUsersService {
    constructor(@InjectRepository(activeUserEntity) private repo: Repository<activeUserEntity>) {}

    async getByChatId(chat_id: string) {
        return await this.repo.find({where: {chat_id: chat_id}});
    }

    async removeUserBySocketId(id: string) {
        return await this.repo.delete({id: id});
    }

    async removeUserByUserId(id: string) {
        return await this.repo.delete({user_id: id});
    }

    async updateUser(data: any) {
        return await this.repo.update({user_id: data.id}, data)
    }

    async addUser(data: any) {
        console.log("lol");
        
        const tmp = this.repo.create(data);
        return await this.repo.save(tmp);
    }
}
