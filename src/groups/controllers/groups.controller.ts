import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Routes, Services } from '../../utils/constants';
import { IGroupService } from '../interfaces/groupsInterface';
import { AuthUser } from '../../utils/decorators';
import { User } from '../../utils/typeorm';
import { CreateGroupDto } from '../dtos/CreateGroup.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TransferOwnerDto } from '../dtos/TransferOwner.dto';

@Controller(Routes.GROUPS)
export class GroupsController {
  constructor(
    @Inject(Services.GROUPS) private readonly groupService: IGroupService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createGroup(@AuthUser() user: User, @Body() payload: CreateGroupDto) {
    const group = await this.groupService.createGroup({
      ...payload,
      creator: user,
    });
    this.eventEmitter.emit('group.create', group);
    return group;
  }

  @Get()
  async getGroups(@AuthUser() user: User) {
    return await this.groupService.getGroups({ userId: user.id });
  }

  @Get(':id')
  async getGroup(@AuthUser() user: User, @Param('id') id: number) {
    return await this.groupService.findGroupById(id);
  }

  @Patch(':id/owner')
  async updateGroupOwner(
    @AuthUser() { id: userId }: User,
    @Param('id') groupId: number,
    @Body() { newOwnerId }: TransferOwnerDto,
  ) {
    const params = { userId, groupId, newOwnerId };

    const group = await this.groupService.transferGroupOwner(params);
    this.eventEmitter.emit('group.owner.update', group);

    return group;
  }
}
