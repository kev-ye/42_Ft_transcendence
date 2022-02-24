import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as pgSession from 'connect-pg-simple';
import * as pg from 'pg';

async function bootstrap() {
  const corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true,
  };
  const pgPool = new pg.Pool({
    host: 'postgres',
    database: 'db',
    user: 'user',
    port: 5432,
    password: 'password',
  });
  const MAX_AGE: number = 60 * 60 * 24 * 1000; // one day
  const connectPgSession = pgSession(session);
  const app = await NestFactory.create(AppModule);

  app.enableCors(corsOptions);
  app.use(cookieParser());
  app.use(
    session({
      store: new connectPgSession({
        pool: pgPool,
        createTableIfMissing: true,
        pruneSessionInterval: 60,
        tableName: 'session',
      }),
      secret: 'transcendence-session-id-secret',
      name: '__pong_session_id__',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: MAX_AGE,
      },
      rolling: true,
    }),
  );
  app.use(function (req, res, next) {
    req.session.touch();
    next();
  });
  app.setGlobalPrefix('api');
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().then();
