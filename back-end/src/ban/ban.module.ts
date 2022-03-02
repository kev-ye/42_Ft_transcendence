import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanService } from './ban.service';
import { BanEntity } from './entity/ban.entity';
import { BanController } from './ban.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BanEntity])],
  providers: [
    {
      provide: 'BAN_SERVICE',
      useClass: BanService
    }
  ],
  exports: [
    {
      provide: 'BAN_SERVICE',
      useClass: BanService
    }
  ],
  controllers: [BanController]
})
export class BanModule {}
