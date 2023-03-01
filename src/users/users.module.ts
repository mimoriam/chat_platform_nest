import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { Services } from '../utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile, User, UserPresence } from '../utils/typeorm';
import { UsersController } from './controllers/users.controller';
import { UserProfileService } from './services/users-profile.service';
import { UserPresenceController } from './controllers/users-presence.controller';
import { UserProfilesController } from './controllers/users-profile.controller';
import { UserPresenceService } from './services/users-presence.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, UserPresence])],
  controllers: [
    UsersController,
    UserPresenceController,
    UserProfilesController,
  ],
  providers: [
    {
      provide: Services.USERS,
      useClass: UsersService,
    },

    {
      provide: Services.USERS_PROFILES,
      useClass: UserProfileService,
    },

    {
      provide: Services.USER_PRESENCE,
      useClass: UserPresenceService,
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

    {
      provide: Services.USER_PRESENCE,
      useClass: UserPresenceService,
    },
  ],
})
export class UsersModule {}
