import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { Services } from '../utils/constants';
import { IConversationsService } from './conversationInterface';
import { CreateConversationDto } from './dtos/CreateConversations.dto';
import { AuthUser } from '../utils/decorators';
import { User } from '../utils/typeorm';

@Controller('conversations')
export class ConversationsController {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationsService: IConversationsService,
  ) {}

  @Post()
  async createConversation(
    @AuthUser() user: User,
    @Body() createConversationPayload: CreateConversationDto,
  ) {
    return this.conversationsService.createConversation(
      user,
      createConversationPayload,
    );
  }
}
