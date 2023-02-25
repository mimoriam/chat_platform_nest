import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { Services } from '../../utils/constants';
import { AuthenticatedRequest } from '../../utils/types';
import { ConversationNotFoundException } from '../exceptions/ConversationNotFound';
import { InvalidConversationIdException } from '../exceptions/InvalidConversation';
import { IConversationsService } from '../conversationInterface';

@Injectable()
export class ConversationMiddleware implements NestMiddleware {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationsService,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    // const isReadable = this.conversationService.isConversationReadable()
    const { id: userId } = req.user;

    const id = parseInt(req.params.id);
    if (isNaN(id)) throw new InvalidConversationIdException();
    const isReadable = await this.conversationService.hasAccess({ id, userId });

    if (isReadable) next();
    else throw new ConversationNotFoundException();
  }
}
