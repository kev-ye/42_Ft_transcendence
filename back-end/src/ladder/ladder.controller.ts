import { Controller, Get, Inject, Param } from '@nestjs/common';
import { LadderService } from './ladder.service';

export const INITIAL_POINTS = 500;

@Controller('ladder')
export class LadderController {
    constructor(@Inject('LADDER_SERVICE') private ladder: LadderService) {}

    @Get(':id')
    async getLadderById(@Param('id') id: string) {
        const tmp = await this.ladder.getPointsFromUser(id);
        if (tmp)
            return tmp;
        return {id: id, gamesPlayed: 0, points: INITIAL_POINTS}
    }

}
