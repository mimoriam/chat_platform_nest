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
import { IFriendRequestService } from './friendsRequestInterface';
import { AuthUser } from '../utils/decorators';
import { User } from '../utils/typeorm';
import { CreateFriendDto } from './dtos/CreateFriend.dto';

@Controller(Routes.FRIEND_REQUESTS)
export class FriendRequestsController {
  constructor(
    @Inject(Services.FRIENDS_REQUESTS_SERVICE)
    private readonly friendRequestService: IFriendRequestService,
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
    return await this.friendRequestService.create(params);
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
    return await this.friendRequestService.cancel({ id, userId });
  }

  @Patch(':id/reject')
  async rejectFriendRequest(
    @AuthUser() { id: userId }: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.friendRequestService.reject({ id, userId });
  }
}
