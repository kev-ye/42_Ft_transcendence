import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { FriendEntity } from './entity/friend.entity';

@Injectable()
export class FriendService {
    constructor(@InjectRepository(FriendEntity) private repo: Repository<FriendEntity>,
    @Inject('USER_SERVICE') private userService: UserService) {
        console.log("friendService");
        
    }

    async addFriend(data: {first: string, second: string}) {
        const tmp = await this.repo.findOne({
            where: [{first: data.first, second: data.second}, {first: data.second, second: data.first}]
        });
        if (!tmp)
        {
            //todo : check if user IDs are valid
            //const user = await this.userService.findUser({id: data.first});

            //todo: send notification?

            const relation = this.repo.create({first: data.first, second: data.second, status: 1});
            return await this.repo.save(relation);
        }
        if (tmp.status != 1)
        {
            console.error("Cannot accept not pending friend invitation");
            return ;
        }
        if (tmp.first == data.first)
        {
            //if emitter of the invite is trying to add again -> don't do anything
            //return ;
        } 
        return await this.repo.update({first: tmp.first, second: tmp.second}, {status: 2});
    }


    //return list of user IDs who are friends with 'id'
    async getFriends(id: string) {
        const tmp = await this.repo.find({
            where: [{first: id}, {second: id}]
        });
        let result = [];
        tmp.forEach(value => {
            if (value.status)
            {
                if (value.first == id)
                    result.push({friend: value.second, status: value.status});
                else
                    result.push({friend: value.first, status: value.status});
            }
        });

        let final: any[] = [];
        for (let userID of result)
        {
            const friend = await this.userService.getUserById(userID.friend);
            if (friend)
                final.push({status: userID.status, username: friend.name, id: friend.id, online: friend.online, avatar: friend.avatar});
        }
        return final;
    }

    async deleteFriend(data: {first: number, second: number}) {
        const tmp = await this.repo.findOne({
            where: [{first: data.first, second: data.second}, {first: data.second, second: data.first}]
        });
        if (!tmp)
        {
            console.error("Cannot deny non-existent invitation");
            return ;
        }

        //todo: send notification
        return await this.repo.remove(tmp);
    }
}
