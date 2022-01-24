import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockController } from './block.controller';
import { Block } from './block.entity';
import { BlockService } from './block.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Block]),
  ],
  controllers: [BlockController],
  providers: [
    {
      provide: 'BLOCK_SERVICE',
      useClass: BlockService
    }
  ],
  exports: [
    {
      provide: 'BLOCK_SERVICE',
      useClass: BlockService
    }
  ]
})
export class BlockModule {}
