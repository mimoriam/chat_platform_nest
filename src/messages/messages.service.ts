import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IMessageService } from './messageInterface';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation, Message } from '../utils/typeorm';
import { Repository } from 'typeorm';
import {
  CreateMessageParams,
  DeleteMessageParams,
  EditMessageParams,
} from '../utils/types';
import { instanceToPlain } from 'class-transformer';
import { Services } from '../utils/constants';
import { IConversationsService } from '../conversations/conversationInterface';
import { ConversationNotFoundException } from '../conversations/exceptions/ConversationNotFound';

@Injectable()
export class MessagesService implements IMessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationsService,
  ) {}

  async createMessage(params: CreateMessageParams) {
    const { user, content, id } = params;
    const conversation = await this.conversationService.findConversationById(
      id,
    );
    if (!conversation) throw new ConversationNotFoundException();

    const { creator, recipient } = conversation;

    if (creator.id !== user.id && recipient.id !== user.id)
      throw new HttpException('Cannot Create Message', HttpStatus.FORBIDDEN);

    const message = this.messageRepository.create({
      content,
      conversation,
      author: instanceToPlain(user),
    });

    const savedMessage = await this.messageRepository.save(message);
    conversation.lastMessageSent = savedMessage;

    const updated = await this.conversationService.save(conversation);
    return { message: savedMessage, conversation: updated };
  }

  async getMessagesByConversationId(
    conversationId: number,
  ): Promise<Message[]> {
    return this.messageRepository.find({
      relations: ['author', 'attachments', 'author.profile'],
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'DESC' },
    });
  }

  async editMessage(params: EditMessageParams) {
    const messageDB = await this.messageRepository.findOne({
      where: {
        id: params.messageId,
        author: { id: params.userId },
      },
      relations: [
        'conversation',
        'conversation.creator',
        'conversation.recipient',
        'author',
        'author.profile',
      ],
    });
    if (!messageDB)
      throw new HttpException('Cannot Edit Message', HttpStatus.BAD_REQUEST);
    messageDB.content = params.content;
    return this.messageRepository.save(messageDB);
  }

  async deleteMessage(params: DeleteMessageParams) {
    const { conversationId } = params;
    const msgParams = { id: conversationId, limit: 5 };
    const conversation = await this.conversationService.getMessages(msgParams);
    if (!conversation) throw new ConversationNotFoundException();

    const message = await this.messageRepository.findOne({
      where: {
        id: params.messageId,
        author: { id: params.userId },
        conversation: { id: params.conversationId },
      },
    });

    if (!message)
      throw new HttpException('Cannot delete message', HttpStatus.BAD_REQUEST);

    if (conversation.lastMessageSent.id !== message.id)
      return this.deleteLastMessage(conversation, message);
  }

  // Deleting Last Message
  async deleteLastMessage(conversation: Conversation, message: Message) {
    const size = conversation.messages.length;
    const SECOND_MESSAGE_INDEX = 1;
    if (size <= 1) {
      console.log('Last Message Sent is deleted');

      await this.conversationService.update({
        id: conversation.id,
        lastMessageSent: null,
      });

      return this.messageRepository.delete({ id: message.id });
    } else {
      console.log('There are more than 1 message');
      const newLastMessage = conversation.messages[SECOND_MESSAGE_INDEX];

      await this.conversationService.update({
        id: conversation.id,
        lastMessageSent: newLastMessage,
      });

      return this.messageRepository.delete({ id: message.id });
    }
  }
}
