import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanService } from './ban.service';
import { BanEntity } from './entity/ban.entity';
import { BanController } from './ban.controller';
import { AppModule } from 'src/app/app.module';
import { ChatGateway } from 'src/chat-gateway/chat.gateway';
import { ChatGatewayModule } from 'src/chat-gateway/chat-gateway.module';

@Module({
  imports: [TypeOrmModule.forFeature([BanEntity]), ChatGatewayModule],
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
