import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// npm i class-validator class-transformer @nestjs/config @nestjs/throttler @nestjs/typeorm typeorm pg cookie-parser bcrypt cookie uuid
// npm i -D @types/cookie-parser @types/bcrypt @types/cookie @types/uuid

// # Sessions:
// npm i passport passport-local @nestjs/passport express-session connect-typeorm
// npm i -D @types/passport @types/passport-local @types/express-session
async function bootstrap() {
  const { PORT } = process.env;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  try {
    await app.listen(PORT, () => console.log(`Running on Port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
}

bootstrap().then();
