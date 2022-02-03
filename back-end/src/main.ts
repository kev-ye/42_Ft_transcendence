import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
  const corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true
  };
	app.enableCors(corsOptions);
  app.use(cookieParser('secret'));
	await app.listen(3000);
	console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();