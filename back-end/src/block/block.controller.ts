import { Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Socket } from 'dgram';
import { UserGuard } from 'src/auth/user.guard';
import { BlockService } from './block.service';

@Controller()
export class BlockController {
    constructor(@Inject('BLOCK_SERVICE') private service: BlockService) {}

    @Post('block')
    @UseGuards(UserGuard)
    async blockUser(@MessageBody() data, @ConnectedSocket() client: Socket) {
        if (!data.first || !data.second)// || data.first == data.second)
        {
            console.error("Wrong formatting for blocking user");
            return ;
        }
        console.log("User " + data.first + " is blocking user " + data.second);
        this.service.blockUser(data);
        return ;
    }

    @Post('unblock')
    @UseGuards(UserGuard)
    async unblockUser(@MessageBody() data, @ConnectedSocket() client: Socket) {
        if (!data.first || !data.second)// || data.first == data.second)
        {
            console.error("Wrong formatting for unblocking user");
            return ;
        }
        console.log("User " + data.first + " is unblocking user " + data.second);
        this.service.unblockUser(data);
        return ;
    }

    @Get('block/:id')
    @UseGuards(UserGuard)
    async getList(@Param('id') id: number) {
        return this.service.getList(id);
    }
}