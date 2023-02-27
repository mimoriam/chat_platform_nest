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
import { Routes, ServerEvents, Services } from '../utils/constants';
import { IFriendRequestService } from './friendsRequestInterface';
import { AuthUser } from '../utils/decorators';
import { User } from '../utils/typeorm';
import { CreateFriendDto } from './dtos/CreateFriend.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.FRIEND_REQUESTS)
export class FriendRequestsController {
  constructor(
    @Inject(Services.FRIENDS_REQUESTS_SERVICE)
    private readonly friendRequestService: IFriendRequestService,
    private event: EventEmitter2,
  ) {}

  @Get()
  async getFriendRequests(@AuthUser() user: User) {
    return await this.friendRequestService.getFriendRequests(user.id);
  }

  // This is for seeing PENDING friend requests:
  @Post()
  async createFriendRequest(
    @AuthUser() user: User,
    @Body() { email }: CreateFriendDto,
  ) {
    const params = { user, email };

    const friendRequest = await this.friendRequestService.create(params);

    this.event.emit('friendrequest.create', friendRequest);
    return friendRequest;
  }

  @Patch(':id/accept')
  async acceptFriendRequest(
    @AuthUser() { id: userId }: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.friendRequestService.accept({ id, userId });
  }

  @Delete(':id/cancel')
  async cancelFriendRequest(
    @AuthUser() { id: userId }: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const response = await this.friendRequestService.cancel({ id, userId });
    this.event.emit('friendrequest.cancel', response);
    return response;
  }

  @Patch(':id/reject')
  async rejectFriendRequest(
    @AuthUser() { id: userId }: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const response = await this.friendRequestService.reject({ id, userId });
    this.event.emit(ServerEvents.FRIEND_REQUEST_REJECTED, response);
    return response;
  }
}
