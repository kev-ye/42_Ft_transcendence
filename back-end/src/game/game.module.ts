import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersModule } from 'src/players/players.module';
import { GameEntity } from './entity/game.entity';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity]), PlayersModule],
  controllers: [GameController],
  providers: [GameService, GameGateway],
  exports: [GameService, GameGateway]
})
export class GameModule {}
