import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Services } from '../../utils/constants';
import {
  AddGroupRecipientParams,
  RemoveGroupRecipientParams,
} from '../../utils/types';
import { IUserService } from '../../users/userInterface';
import { IGroupRecipientService } from '../interfaces/group-recipientInterface';
import { IGroupService } from '../interfaces/groupsInterface';
import { GroupNotFoundException } from '../exceptions/GroupNotFound';
import { NotGroupOwnerException } from '../exceptions/NotGroupOwner';

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

  /**
   * Removes a Group Recipient as a Group Owner.
   * Does not allow users to leave the group.
   */
  async removeGroupRecipient(params: RemoveGroupRecipientParams) {
    const { issuerId, removeUserId, id } = params;
    const group = await this.groupService.findGroupById(id);

    if (!group) throw new GroupNotFoundException();
    // Not group owner
    if (group.creator.id !== issuerId) throw new NotGroupOwnerException();
    // Temporary

    if (group.creator.id === removeUserId)
      throw new HttpException(
        'Cannot remove yourself as owner',
        HttpStatus.BAD_REQUEST,
      );

    group.users = group.users.filter((u) => u.id !== removeUserId);
    return this.groupService.saveGroup(group);
  }
}
