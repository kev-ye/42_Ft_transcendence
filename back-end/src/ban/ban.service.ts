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

    async isBanned(userID: string, chatID: string) {
        return await this.repo.findOne({user_id: userID, chat_id: chatID});
    }

    async banUser(data: {chat_id: string, user_id: string}) {
        if (await this.repo.findOne({where: {chat_id: data.chat_id, user_id: data.user_id}}))
            return false;
        const tmp = this.repo.create(data);
        await this.repo.save(tmp);
        return true;
    }

    async deleteBan(userID: string, chatID: string) {
        return await this.repo.delete({chat_id: chatID, user_id: userID});
    }

    async deleteAllByChatId(chatID: string) {
        return await this.repo.delete({chat_id: chatID});
    }
}
