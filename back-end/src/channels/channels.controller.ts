import { Controller, Get, Inject, Post } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { ChannelsService } from './channels.service';

@Controller('channels')
export class ChannelsController {
    constructor(@Inject('CHANNELS_SERVICE') private service: ChannelsService) {}

    @Get()
    async getChannels() {
        return await this.service.getAll();
    }

    @Post()
    async createChannel(@MessageBody() data: any) {
        return await this.service.createChannel(data);
    }
}
