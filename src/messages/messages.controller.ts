import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { IMessageService } from './messageInterface';
import { AuthUser } from '../utils/decorators';
import { User } from '../utils/typeorm';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EditMessageDto } from './dtos/EditMessage.dto';

@Controller(Routes.MESSAGES)
export class MessagesController {
  constructor(
    @Inject(Services.MESSAGES) private readonly messageService: IMessageService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createMessage(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) conversationId: number,
    @Body()
    { content }: CreateMessageDto,
  ) {
    // const response = await this.messageService.createMessage({
    //   ...createMessageDto,
    //   user,
    // });

    const params = { user, conversationId, content };
    const response = await this.messageService.createMessage(params);

    this.eventEmitter.emit('message.create', response);

    return response;
  }

  @Get()
  async getMessagesFromConversation(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const messages = await this.messageService.getMessagesByConversationId(id);
    return { id, messages };
  }

  // api/conversations/:conversationId/messages/:messageId
  @Patch(':messageId')
  async editMessage(
    @AuthUser() { id: userId }: User,
    @Param('id') conversationId: number,
    @Param('messageId') messageId: number,
    @Body() { content }: EditMessageDto,
  ) {
    const params = { userId, content, conversationId, messageId };
    const message = await this.messageService.editMessage(params);

    this.eventEmitter.emit('message.update', message);
    return message;
  }

  @Delete(':messageId')
  async deleteMessageFromConversation(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) conversationId: number,
    @Param('messageId', ParseIntPipe) messageId: number,
  ) {
    await this.messageService.deleteMessage({
      userId: user.id,
      conversationId,
      messageId,
    });

    this.eventEmitter.emit('message.delete', {
      userId: user.id,
      messageId,
      conversationId,
    });

    return { conversationId, messageId };
  }
}
