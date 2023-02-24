import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './utils/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConversationsModule } from './conversations/conversations.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ envFilePath: '.env.development' }),
    PassportModule.register({ session: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_DB_HOST,
      port: parseInt(process.env.PG_DB_PORT),
      username: process.env.PG_DB_USERNAME,
      password: process.env.PG_DB_PASSWORD,
      database: process.env.PG_DB_NAME,
      synchronize: true,
      entities,
    }),
    ConversationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
