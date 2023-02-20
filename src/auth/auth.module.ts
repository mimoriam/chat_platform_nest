import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Services } from '../utils/constants';
import { UsersModule } from '../users/users.module';
import { SessionSerializer } from './utils/SessionSerializer';
import { LocalStrategy } from './utils/LocalStrategy';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
    LocalStrategy,
    SessionSerializer,
  ],
})
export class AuthModule {}
