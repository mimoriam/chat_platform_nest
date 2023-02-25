import { Module } from '@nestjs/common';
import { GroupMessagesService } from './group-messages.service';
import { GroupMessagesController } from './group-messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group, GroupMessage } from '../utils/typeorm';
import { Services } from '../utils/constants';
import { GroupsModule } from '../groups/groups.module';

@Module({
  imports: [TypeOrmModule.forFeature([GroupMessage, Group]), GroupsModule],
  controllers: [GroupMessagesController],
  providers: [
    {
      provide: Services.GROUP_MESSAGES,
      useClass: GroupMessagesService,
    },
  ],
})
export class GroupMessagesModule {}
