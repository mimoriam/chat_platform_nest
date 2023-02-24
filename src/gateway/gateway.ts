import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { Inject } from '@nestjs/common';
import { Services } from '../utils/constants';
import { IGatewaySessionManager } from './gateway.session';
import { AuthenticatedSocket } from '../utils/interfaces';
import { CreateMessageResponse } from '../utils/types';
import { Conversation } from '../utils/typeorm';
import { IConversationsService } from '../conversations/conversationInterface';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class MessagingGateway implements OnGatewayConnection {
  constructor(
    @Inject(Services.GATEWAY_SESSION_MANAGER)
    private readonly sessions: IGatewaySessionManager,
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationsService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    this.sessions.setUserSocket(socket.user.id, socket);
    socket.emit('connected', { status: 'good' });
  }

  @SubscribeMessage('createMessage')
  handleCreateMessage(@MessageBody() data: any) {}

  @SubscribeMessage('onClientConnect')
  onClientConnect(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    console.log('onClientConnect');
    console.log(data);
    console.log(client.user);
  }

  @OnEvent('message.create')
  handleMessageCreateEvent(payload: CreateMessageResponse) {
    const {
      author,
      conversation: { creator, recipient },
    } = payload.message;

    const authorSocket = this.sessions.getUserSocket(author.id);
    const recipientSocket =
      author.id === creator.id
        ? this.sessions.getUserSocket(recipient.id)
        : this.sessions.getUserSocket(creator.id);

    if (authorSocket) authorSocket.emit('onMessage', payload);
    if (recipientSocket) recipientSocket.emit('onMessage', payload);
  }

  @OnEvent('conversation.create')
  handleConversationCreateEvent(payload: Conversation) {
    console.log('Inside conversation.create');
    console.log(payload.recipient);
    const recipientSocket = this.sessions.getUserSocket(payload.recipient.id);
    if (recipientSocket) recipientSocket.emit('onConversation', payload);
  }

  @OnEvent('message.delete')
  async handleMessageDelete(payload) {
    const conversation = await this.conversationService.findConversationById(
      payload.conversationId,
    );
    if (!conversation) return;
    const { creator, recipient } = conversation;
    const recipientSocket =
      creator.id === payload.userId
        ? this.sessions.getUserSocket(recipient.id)
        : this.sessions.getUserSocket(creator.id);
    if (recipientSocket) recipientSocket.emit('onMessageDelete', payload);
  }
}
