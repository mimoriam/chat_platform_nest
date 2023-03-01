import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from '../utils/typeorm';
import { IFriendsService } from './friendsInterface';
import { DeleteFriendRequestParams } from '../utils/types';
import { FriendNotFoundException } from './exceptions/FriendNotFound';
import { DeleteFriendException } from './exceptions/DeleteFriend';

@Injectable()
export class FriendsService implements IFriendsService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendsRepository: Repository<Friend>,
  ) {}

  async getFriends(id: number): Promise<Friend[]> {
    return await this.friendsRepository.find({
      where: [{ sender: { id } }, { receiver: { id } }],
      relations: [
        'sender',
        'receiver',
        'sender.profile',
        'sender.presence',
        'receiver.profile',
        'receiver.presence',
      ],
    });
  }

  async findFriendById(id: number): Promise<Friend> {
    return this.friendsRepository.findOne({
      where: { id },
      relations: [
        'sender',
        'receiver',
        'sender.profile',
        'receiver.profile',
        'receiver.presence',
        'sender.presence',
      ],
    });
  }

  async deleteFriend({ id, userId }: DeleteFriendRequestParams) {
    const friend = await this.findFriendById(id);

    if (!friend) throw new FriendNotFoundException();

    if (friend.receiver.id !== userId && friend.sender.id !== userId)
      throw new DeleteFriendException();

    await this.friendsRepository.delete(id);
    return friend;
  }

  async isFriends(userOneId: number, userTwoId: number) {
    return this.friendsRepository.findOne({
      where: [
        {
          sender: { id: userOneId },
          receiver: { id: userTwoId },
        },
        {
          sender: { id: userTwoId },
          receiver: { id: userOneId },
        },
      ],
    });
  }
}
