import { Module } from '@nestjs/common';
import { ModeratorService } from './moderator.service';
import { ModeratorController } from './moderator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModeratorEntity } from './entity/moderator.entity';
import { ChannelsModule } from 'src/channels/channels.module';

@Module({
  imports: [TypeOrmModule.forFeature([ModeratorEntity])],
  providers: [ModeratorService],
  controllers: [ModeratorController],
  exports: [ModeratorService]
})
export class ModeratorModule {}
