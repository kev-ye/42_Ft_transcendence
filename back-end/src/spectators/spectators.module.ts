import { Module } from '@nestjs/common';
import { SpectatorsService } from './spectators.service';
import { SpectatorsController } from './spectators.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule],
  providers: [SpectatorsService],
  controllers: [SpectatorsController]
})
export class SpectatorsModule {}
