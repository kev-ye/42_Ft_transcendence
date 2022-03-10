import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as session from 'express-session';
import * as pgSession from 'connect-pg-simple';
import * as pg from 'pg';

async function bootstrap() {
  const pgPool = new pg.Pool({
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    port: parseInt(process.env.PG_PORT) || 5432,
    password: process.env.PG_PW,
  });
  const MAX_AGE: number = 60 * 60 * 24 * 1000; // one day
  const connectPgSession = pgSession(session);
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      store: new connectPgSession({
        pool: pgPool,
        createTableIfMissing: true,
        pruneSessionInterval: 60,
        tableName: process.env.SESSION_TABLE_NAME,
      }),
      secret: process.env.SESSION_SECRET,
      name: process.env.SESSION_NAME,
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
  app.setGlobalPrefix(process.env.GLOBAL_API_PREFIX);
  await app.listen(parseInt(process.env.BACKEND_PORT) || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().then();
