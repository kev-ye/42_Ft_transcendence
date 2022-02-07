import { Controller, Get, Inject, Param } from '@nestjs/common';
import { PrivateService } from './private.service';

@Controller('private')
export class PrivateController {
    constructor(@Inject('PRIVATE_SERVICE') private service: PrivateService) {}

    @Get(':from/:to')
    async getPrivateMessages(@Param('from') from: string, @Param('to') to: string) {
        return await this.service.getMessages({first: from, second: to});
    }
}
