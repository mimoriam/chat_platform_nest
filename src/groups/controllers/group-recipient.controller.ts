import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Routes, Services } from '../../utils/constants';
import { IGroupRecipientService } from '../interfaces/group-recipientInterface';
import { AuthUser } from '../../utils/decorators';
import { User } from '../../utils/typeorm';
import { AddGroupRecipientDto } from '../dtos/AddGroupRecipient.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.GROUP_RECIPIENTS)
export class GroupRecipientsController {
  constructor(
    @Inject(Services.GROUP_RECIPIENTS)
    private readonly groupRecipientService: IGroupRecipientService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async addGroupRecipient(
    @AuthUser() { id: userId }: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() { username }: AddGroupRecipientDto,
  ) {
    const params = { id, userId, username };
    const response = await this.groupRecipientService.addGroupRecipient(params);

    this.eventEmitter.emit('group.user.add', response);
    return response;
  }

  @Delete('/leave')
  async leaveGroup(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) groupId: number,
  ) {
    return await this.groupRecipientService.leaveGroup({
      id: groupId,
      userId: user.id,
    });
  }

  @Delete(':userId')
  async removeGroupRecipient(
    @AuthUser() { id: issuerId }: User,
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) removeUserId: number,
  ) {
    const params = { issuerId, id, removeUserId };

    const response = await this.groupRecipientService.removeGroupRecipient(
      params,
    );

    this.eventEmitter.emit('group.user.remove', response);
    return response.group;
  }
}
