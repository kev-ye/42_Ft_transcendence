import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivateController } from './private.controller';
import { Private } from './private.entity';
import { PrivateService } from './private.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Private])
  ],
  controllers: [PrivateController],
  providers: [
    {
      provide: 'PRIVATE_SERVICE',
      useClass: PrivateService
    }
  ],
  exports: [
    {
      provide: 'PRIVATE_SERVICE',
      useClass: PrivateService
    }
  ]
})
export class PrivateModule {}
