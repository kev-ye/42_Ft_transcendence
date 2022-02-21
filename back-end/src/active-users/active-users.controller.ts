import { Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { ActiveUsersService } from './active-users.service';

@Controller('active-users')
export class ActiveUsersController {
    constructor(@Inject('ACTIVE_USERS_SERVICE') private service: ActiveUsersService) {}

    @Get(':id') 
    async getUsersInChat(@Param('id') id: string) {
        return await this.service.getUsersByChatId(id);
    }

    @Delete()
    async removeUserFromChat(@MessageBody() data: any)
    {
        return await this.service.removeUserByUserId(data.user_id);
    }

    @Post()
    async newUser(@MessageBody() data: any) {
        return await this.service.addUser(data);
    }

    @Put()
    async updateUser(@MessageBody() data: any) {
        return await this.service.updateUser(data);
    }
}
