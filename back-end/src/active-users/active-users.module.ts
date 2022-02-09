import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiveUsersController } from './active-users.controller';
import { ActiveUsersService } from './active-users.service';
import { activeUserEntity } from './entity/activeUsers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([activeUserEntity])],
  controllers: [ActiveUsersController],
  providers: [
    {
      provide: 'ACTIVE_USERS_SERVICE',
      useClass: ActiveUsersService
    }
  ],
  exports: [
    {
      provide: 'ACTIVE_USERS_SERVICE',
      useClass: ActiveUsersService
    }
  ]
})
export class ActiveUsersModule {}
