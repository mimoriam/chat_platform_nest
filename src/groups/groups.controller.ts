import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { IGroupService } from './groupsInterface';
import { AuthUser } from '../utils/decorators';
import { User } from '../utils/typeorm';
import { CreateGroupDto } from './dtos/CreateGroup.dto';

@Controller(Routes.GROUPS)
export class GroupsController {
  constructor(
    @Inject(Services.GROUPS) private readonly groupService: IGroupService,
  ) {}

  @Post()
  async createGroup(@AuthUser() user: User, @Body() payload: CreateGroupDto) {
    this.groupService.createGroup({ ...payload, creator: user });
  }

  @Get()
  async getGroups(@AuthUser() user: User) {
    return await this.groupService.getGroups({ userId: user.id });
  }

  @Get(':id')
  async getGroup(@AuthUser() user: User, @Param('id') id: number) {
    return this.groupService.getGroupById(id);
  }
}
