import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Services } from '../utils/constants';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '../utils/typeorm';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Group])],
  controllers: [GroupsController],
  providers: [
    {
      provide: Services.GROUPS,
      useClass: GroupsService,
    },
  ],
})
export class GroupsModule {}
