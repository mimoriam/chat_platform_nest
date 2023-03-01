import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

@Injectable()
export class MessagesService implements IMessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async createMessage({ user, content, conversationId }: CreateMessageParams) {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: [
        'creator',
        'recipient',
        'lastMessageSent',
        'creator.profile',
        'recipient.profile',
      ],
    });

    if (!conversation)
      throw new HttpException('Conversation not found', HttpStatus.BAD_REQUEST);

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

    const updatedConversation = await this.conversationRepository.save(
      conversation,
    );

    return { message: savedMessage, conversation: updatedConversation };
  }

  async getMessagesByConversationId(
    conversationId: number,
  ): Promise<Message[]> {
    return this.messageRepository.find({
      relations: ['author'],
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
      ],
    });
    if (!messageDB)
      throw new HttpException('Cannot Edit Message', HttpStatus.BAD_REQUEST);
    messageDB.content = params.content;
    return this.messageRepository.save(messageDB);
  }

  async deleteMessage(params: DeleteMessageParams) {
    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('id = :conversationId', { conversationId: params.conversationId })
      .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('conversation.messages', 'message')
      .where('conversation.id = :conversationId', {
        conversationId: params.conversationId,
      })
      .orderBy('message.createdAt', 'DESC')
      .limit(5)
      .getOne();

    if (!conversation)
      throw new HttpException('Conversation not found', HttpStatus.BAD_REQUEST);

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
      return this.messageRepository.delete({ id: message.id });

    // Deleting Last Message
    const size = conversation.messages.length;
    const SECOND_MESSAGE_INDEX = 1;
    if (size <= 1) {
      console.log('Last Message Sent is deleted');
      await this.conversationRepository.update(
        { id: params.conversationId },
        { lastMessageSent: null },
      );
      return await this.messageRepository.delete({ id: message.id });
    } else {
      console.log('There are more than 1 message');
      const newLastMessage = conversation.messages[SECOND_MESSAGE_INDEX];
      await this.conversationRepository.update(
        { id: params.conversationId },
        { lastMessageSent: newLastMessage },
      );
      return await this.messageRepository.delete({ id: message.id });
    }
  }
}
