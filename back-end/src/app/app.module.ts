import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

/* Custom imports */
import { UserModule } from '../user/user.module';
import { UserEntity } from '../entities/user.entity';


@Module({
  imports: [
	TypeOrmModule.forRoot({
		type: 'postgres',
		host: 'localhost',
		port: 5432,
		username: 'yek',
		password: '',
		database: 'test',
		synchronize: true,
		// logging: false,
		// dropSchema: false, // don't use in prod
		entities: [ UserEntity ]
		// entities: ['../entities/*.entity{.ts,.js}']
		}),
		UserModule,
	]
})
export class AppModule {
	constructor(private connection: Connection) {}
}
