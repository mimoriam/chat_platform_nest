import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GroupsService } from './services/groups.service';
import { GroupsController } from './controllers/groups.controller';
import { Services } from '../utils/constants';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group, GroupMessage } from '../utils/typeorm';
import { GroupMessagesController } from './controllers/group-messages.controller';
import { GroupMessagesService } from './services/group-messages.service';
import { GroupRecipientService } from './services/group-recipient.service';
import { GroupRecipientsController } from './controllers/group-recipient.controller';
import { isAuthorized } from '../utils/helpers';
import { GroupMiddleware } from './middleware/group.middleware';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Group, GroupMessage])],
  controllers: [
    GroupsController,
    GroupMessagesController,
    GroupRecipientsController,
  ],
  providers: [
    {
      provide: Services.GROUPS,
      useClass: GroupsService,
    },

    {
      provide: Services.GROUP_MESSAGES,
      useClass: GroupMessagesService,
    },
    {
      provide: Services.GROUP_RECIPIENTS,
      useClass: GroupRecipientService,
    },
  ],
  exports: [
    {
      provide: Services.GROUPS,
      useClass: GroupsService,
    },
  ],
})
export class GroupsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(isAuthorized, GroupMiddleware).forRoutes('groups/:id');
  }
}
