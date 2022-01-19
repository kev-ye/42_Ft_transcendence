import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LadderController } from './ladder.controller';
import { Ladder } from './ladder.entity';
import { LadderService } from './ladder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ladder])
  ],
  controllers: [LadderController],
  providers: [
    {
      provide: 'LADDER_SERVICE',
      useClass: LadderService
    }
  ],
  exports: [
    {
      provide: 'LADDER_SERVICE',
      useClass: LadderService
    }
  ]
})
export class LadderModule {}
