import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { PrivateMessageEntity } from './entity/private_message.entity';

@Injectable()
export class PrivateService {
    constructor(@InjectRepository(PrivateMessageEntity) private repo: Repository<PrivateMessageEntity>,
    @Inject('USER_SERVICE') private userService: UserService) {}

    async postMessage(userID: string, data: {to: string, type: number, message?: string}) {
        const tmp = this.repo.create({from: userID, ...data});
        return await this.repo.save(tmp);
    }

    async getMessages(data: {first: string, second: string}) {
        const tmp = await this.repo.find({where : [
            {from: data.first, to: data.second},
            {from: data.second, to: data.first}
        ], order: {date: 'DESC'}});
        tmp.splice(20);
        tmp.reverse();
        let result = [];
        const first = await this.userService.getUserById(data.first);
        const second = await this.userService.getUserById(data.second);
        
        tmp.forEach(val => {
            let obj: any = {user_id: val.from, message: val.message, type: val.type};
            if (obj.user_id == first.id)
                obj = {...obj, username: first.name};
            else
                obj = {...obj, username: second.name};
            result.push(obj);
        });


        return result;
    }
}
