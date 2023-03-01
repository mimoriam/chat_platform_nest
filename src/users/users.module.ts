import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { Services } from '../utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile, User } from '../utils/typeorm';
import { UsersController } from './controllers/users.controller';
import { UserProfileService } from './services/users-profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [UsersController],
  providers: [
    {
      provide: Services.USERS,
      useClass: UsersService,
    },

    {
      provide: Services.USERS_PROFILES,
      useClass: UserProfileService,
    },
  ],

  exports: [
    {
      provide: Services.USERS,
      useClass: UsersService,
    },

    {
      provide: Services.USERS_PROFILES,
      useClass: UserProfileService,
    },
  ],
})
export class UsersModule {}
