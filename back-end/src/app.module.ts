import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Users } from './entities/users.entity';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'test',
      username: 'yek',
      password: '',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Users])
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
