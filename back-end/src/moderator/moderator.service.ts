import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelsService } from 'src/channels/channels.service';
import { Repository } from 'typeorm';
import { ModeratorEntity } from './entity/moderator.entity';

@Injectable()
export class ModeratorService {
    constructor(@InjectRepository(ModeratorEntity) private repo: Repository<ModeratorEntity>) {}

    async createModerator(userID: string, data: any) {
        //todo check if userID is creator of channel and if channel exists
        if (await this.repo.findOne({user_id: data.user_id, chat_id: data.chat_id}))
            return ;
        const tmp = this.repo.create(data);
        return await this.repo.save(tmp);
    }

    async deleteModerator(userID: string, data: any) {

        return await this.repo.delete({chat_id: data.chat_id, user_id: data.user_id});
    }

    async deleteAllModerator(userID: string, data: any) {
        return await this.repo.delete({chat_id: data.chat_id});
    }

    async isModerator(chatID: string, userID: string) {
        return await this.repo.findOne({chat_id: chatID, user_id: userID});
    }

    async getModeratorsByChatID(chat_id: string) {
        return await this.repo.find({chat_id: chat_id});
    }
}
