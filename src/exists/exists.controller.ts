import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { IConversationsService } from '../conversations/conversationInterface';
import { IUserService } from '../users/interfaces/userInterface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthUser } from '../utils/decorators';
import { User } from '../utils/typeorm';

@Controller(Routes.EXISTS)
export class ExistsController {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationsService: IConversationsService,
    @Inject(Services.USERS)
    private readonly userService: IUserService,
    private readonly events: EventEmitter2,
  ) {}

  @Get('conversations/:recipientId')
  async checkConversationExists(
    @AuthUser() user: User,
    @Param('recipientId', ParseIntPipe) recipientId: number,
  ) {
    const conversation = await this.conversationsService.isCreated(
      recipientId,
      user.id,
    );
    if (conversation) return conversation;
    const recipient = await this.userService.findOneUser({ id: recipientId });
    if (!recipient)
      throw new HttpException('Recipient Not Found', HttpStatus.NOT_FOUND);
    const newConversation = await this.conversationsService.createConversation(
      user,
      {
        username: recipient.username,
        message: 'hello',
      },
    );
    this.events.emit('conversation.create', newConversation);
    return newConversation;
  }
}
