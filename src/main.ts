import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { TypeormStore } from 'connect-typeorm';
import { DataSource } from 'typeorm';
import { getRepository } from 'typeorm';
import entities, { Session } from './utils/typeorm';

// npm i class-validator class-transformer @nestjs/config @nestjs/throttler @nestjs/typeorm typeorm pg cookie-parser bcrypt cookie uuid
// npm i -D @types/cookie-parser @types/bcrypt @types/cookie @types/uuid

// # Sessions:
// npm i passport passport-local @nestjs/passport express-session connect-typeorm
// npm i -D @types/passport @types/passport-local @types/express-session
async function bootstrap() {
  const { PORT, COOKIE_SECRET } = process.env;
  const app = await NestFactory.create(AppModule);
  // We'll leave the deprecated symbol as is because we typically use connect-redis instead of typeorm for sessions:
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.PG_DB_HOST,
    port: parseInt(process.env.PG_DB_PORT),
    username: process.env.PG_DB_USERNAME,
    password: process.env.PG_DB_PASSWORD,
    database: process.env.PG_DB_NAME,
    synchronize: true,
    entities,
  });
  await dataSource.initialize();
  const sessionRepository = dataSource.getRepository(Session);
  // const sessionRepository = getRepository(Session);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: ['http://localhost:3000'], credentials: true });
  app.useGlobalPipes(new ValidationPipe());

  app.use(
    session({
      secret: COOKIE_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 86400000, // cookie expires 1 day later
      },
      store: new TypeormStore().connect(sessionRepository),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  try {
    await app.listen(PORT, () => {
      console.log(`Running on Port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

bootstrap().then();
