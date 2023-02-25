import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Services } from '../../utils/constants';
import { AddGroupRecipientParams } from '../../utils/types';
import { IUserService } from '../../users/userInterface';
import { IGroupRecipientService } from '../interfaces/group-recipientInterface';
import { IGroupService } from '../interfaces/groupsInterface';

@Injectable()
export class GroupRecipientService implements IGroupRecipientService {
  constructor(
    @Inject(Services.USERS) private userService: IUserService,
    @Inject(Services.GROUPS) private groupService: IGroupService,
  ) {}

  async addGroupRecipient(params: AddGroupRecipientParams) {
    const group = await this.groupService.findGroupById(params.id);

    if (!group)
      throw new HttpException('Group not found', HttpStatus.BAD_REQUEST);

    const recipient = await this.userService.findOneUser({
      email: params.email,
    });

    if (!recipient)
      throw new HttpException('Cannot Add User', HttpStatus.BAD_REQUEST);

    if (group.creator.id !== params.userId)
      throw new HttpException('Insufficient Permissions', HttpStatus.FORBIDDEN);

    const inGroup = group.users.find((user) => user.id === recipient.id);

    if (inGroup)
      throw new HttpException('User already in group', HttpStatus.BAD_REQUEST);

    group.users = [...group.users, recipient];
    return this.groupService.saveGroup(group);
  }
}
