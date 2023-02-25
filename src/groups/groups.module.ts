import { Module } from '@nestjs/common';
import { GroupsService } from './services/groups.service';
import { GroupsController } from './controllers/groups.controller';
import { Services } from '../utils/constants';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group, GroupMessage } from '../utils/typeorm';
import { GroupMessagesController } from './controllers/group-messages.controller';
import { GroupMessagesService } from './services/group-messages.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Group, GroupMessage])],
  controllers: [GroupsController, GroupMessagesController],
  providers: [
    {
      provide: Services.GROUPS,
      useClass: GroupsService,
    },

    {
      provide: Services.GROUP_MESSAGES,
      useClass: GroupMessagesService,
    },
  ],
  exports: [
    {
      provide: Services.GROUPS,
      useClass: GroupsService,
    },
  ],
})
export class GroupsModule {}
