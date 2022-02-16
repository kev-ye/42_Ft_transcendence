import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuteService } from './mute.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [
    {
      provide: 'MUTE_SERVICE',
      useClass: MuteService
    }
  ],
  exports: [
    {
      provide: 'MUTE_SERVICE',
      useClass: MuteService
    }
  ]
})
export class MuteModule {}
