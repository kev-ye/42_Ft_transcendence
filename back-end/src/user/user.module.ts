import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserMiddleWare } from '../common/middleware/user.middleware';

@Module({
	controllers: [ UserController ],
	providers: [ UserService ]
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
	}
}
