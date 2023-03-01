import { Inject, Injectable } from '@nestjs/common';
import { IFriendRequestService } from './friendsRequestInterface';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend, FriendRequest } from '../utils/typeorm';
import { Repository } from 'typeorm';
import { Services } from '../utils/constants';
import { IUserService } from '../users/interfaces/userInterface';
import {
  CancelFriendRequestParams,
  CreateFriendParams,
  FriendRequestParams,
} from '../utils/types';
import { UserNotFoundException } from '../users/exceptions/UserNotFound';
import { FriendRequestPending } from './exceptions/FriendRequestPending';
import { FriendRequestNotFoundException } from './exceptions/FriendRequestNotFound';
import { FriendRequestAcceptedException } from './exceptions/FriendRequestAccepted';
import { FriendRequestException } from './exceptions/FriendRequest';
import { IFriendsService } from '../friends/friendsInterface';
import { FriendAlreadyExists } from '../friends/exceptions/FriendAlreadyExists';

@Injectable()
export class FriendRequestService implements IFriendRequestService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    @Inject(Services.USERS)
    private readonly userService: IUserService,
    @Inject(Services.FRIENDS_SERVICE)
    private readonly friendsService: IFriendsService,
  ) {}

  async create({ user: sender, username }: CreateFriendParams) {
    const receiver = await this.userService.findOneUser({ username });

    if (!receiver) throw new UserNotFoundException();

    const exists = await this.isPending(sender.id, receiver.id);

    if (exists) throw new FriendRequestPending();

    // Prevent someone from adding themselves as friend
    if (receiver.id === sender.id)
      throw new FriendRequestException('Cannot Add Yourself');

    const isFriends = await this.friendsService.isFriends(
      sender.id,
      receiver.id,
    );
    if (isFriends) throw new FriendAlreadyExists();

    const friend = this.friendRequestRepository.create({
      sender,
      receiver,
      status: 'pending',
    });

    return this.friendRequestRepository.save(friend);
  }

  async isPending(userOneId: number, userTwoId: number) {
    return this.friendRequestRepository.findOne({
      where: [
        {
          sender: { id: userOneId },
          receiver: { id: userTwoId },
          status: 'pending',
        },
        {
          sender: { id: userTwoId },
          receiver: { id: userOneId },
          status: 'pending',
        },
      ],
    });
  }

  async accept({ id, userId }: FriendRequestParams) {
    const friendRequest = await this.findById(id);

    if (!friendRequest) throw new FriendRequestNotFoundException();

    if (friendRequest.status === 'accepted')
      throw new FriendRequestAcceptedException();

    if (friendRequest.receiver.id !== userId)
      throw new FriendRequestException();

    friendRequest.status = 'accepted';

    const updatedFriendRequest = await this.friendRequestRepository.save(
      friendRequest,
    );

    const newFriend = this.friendRepository.create({
      sender: friendRequest.sender,
      receiver: friendRequest.receiver,
    });

    const friend = await this.friendRepository.save(newFriend);
    return { friend, friendRequest: updatedFriendRequest };
  }

  // Cancel sent friend request by the owner
  async cancel({ id, userId }: CancelFriendRequestParams) {
    const friendRequest = await this.findById(id);

    if (!friendRequest) throw new FriendRequestNotFoundException();

    if (friendRequest.sender.id !== userId) throw new FriendRequestException();
    await this.friendRequestRepository.delete(id);
    return friendRequest;
  }

  async reject({ id, userId }: CancelFriendRequestParams) {
    const friendRequest = await this.findById(id);

    if (!friendRequest) throw new FriendRequestNotFoundException();

    if (friendRequest.status === 'accepted')
      throw new FriendRequestAcceptedException();

    if (friendRequest.receiver.id !== userId)
      throw new FriendRequestException();

    friendRequest.status = 'rejected';
    return this.friendRequestRepository.save(friendRequest);
  }

  async findById(id: number): Promise<FriendRequest> {
    return this.friendRequestRepository.findOne({
      where: {
        id,
      },
      relations: ['receiver', 'sender'],
    });
  }

  async getFriendRequests(id: number): Promise<FriendRequest[]> {
    const status = 'pending';

    return this.friendRequestRepository.find({
      where: [
        { sender: { id }, status },
        { receiver: { id }, status },
      ],
      relations: ['receiver', 'sender'],
    });
  }
}
