import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { IConversationsService } from './conversationInterface';
import { CreateConversationDto } from './dtos/CreateConversations.dto';
import { AuthUser } from '../utils/decorators';
import { User } from '../utils/typeorm';
import { AuthenticatedGuard } from '../auth/utils/Guards';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.CONVERSATIONS)
@UseGuards(AuthenticatedGuard)
export class ConversationsController {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationsService: IConversationsService,
    private readonly events: EventEmitter2,
  ) {}

  @Post()
  async createConversation(
    @AuthUser() user: User,
    @Body() createConversationPayload: CreateConversationDto,
  ) {
    const conversation = await this.conversationsService.createConversation(
      user,
      createConversationPayload,
    );

    this.events.emit('conversation.create', conversation);
    return conversation;
  }

  @Get()
  async getConversations(@AuthUser() { id }: User) {
    return this.conversationsService.getConversations(id);
  }

  @Get(':id')
  async getConversationById(@Param('id') id: number) {
    const conversation = await this.conversationsService.findConversationById(
      id,
    );
    return conversation;
  }
}
