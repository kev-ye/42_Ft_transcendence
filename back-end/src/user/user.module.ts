import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserMiddleWare } from '../common/middleware/user.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';

@Module({
	imports: [ TypeOrmModule.forFeature([UserEntity]) ],
	controllers: [ UserController ],
	providers: [ 
		{
			provide: 'USER_SERVICE',
			useClass: UserService
		}
	 ],
	exports: [ {
		provide: 'USER_SERVICE',
		useClass: UserService
	} ]
})
export class UserModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(UserMiddleWare).forRoutes({
			path: 'user',
			method: RequestMethod.GET
		});
		consumer.apply(UserMiddleWare).forRoutes({
			path: 'user/id/:id',
			method: RequestMethod.GET
		});
		consumer.apply(UserMiddleWare).forRoutes({
			path: 'user/name/:name',
			method: RequestMethod.GET
		});
		consumer.apply(UserMiddleWare).forRoutes({
			path: 'user/update',
			method: RequestMethod.PUT
		});
		consumer.apply(UserMiddleWare).forRoutes({
			path: 'user/delete/:id',
			method: RequestMethod.POST
		});
	}
}
