import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivateController } from './private.controller';
import { PrivateMessageEntity } from './entity/private_message.entity';
import { PrivateService } from './private.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrivateMessageEntity]),
    UserModule
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
