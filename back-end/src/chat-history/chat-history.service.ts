import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatHistoryEntity } from './entity/chat_history.entity';


@Injectable()
export class ChatHistoryService {
    constructor(@InjectRepository(ChatHistoryEntity) private repo: Repository<ChatHistoryEntity>) {}

    async showAll() {
        return await this.repo.find({ order: {
                created: 'ASC'
            }});
    }

    async showChat(chat_id: number) {
        let result: any[] = await this.repo.query('select * from history where chat_id=\''
        + chat_id
        + "\' order by created desc limit " + 20 + ";");
        result.reverse();
        return result;
    }

    async create(data: any) {
        const message = this.repo.create(data);
        return await this.repo.save(message);
    }

    async showMessageById(msg_id: number)
    {
        return await this.repo.findOne( { where: {id: msg_id}});
    }

    async showUser(user_id: number, channel_id?: number) {
        if (!channel_id)
            return await this.repo.find({where: {user_id: user_id}});
        return await this.repo.find({where: {user_id: user_id, chat_id: channel_id}});
    }
}
