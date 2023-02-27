import { FriendRequest } from '../utils/typeorm';
import {
  CancelFriendRequestParams,
  CreateFriendParams,
  FriendRequestParams,
} from '../utils/types';

export interface IFriendRequestService {
  create(params: CreateFriendParams);

  isPending(userOneId: number, userTwoId: number);

  isFriends(userOneId: number, userTwoId: number);

  accept(params: FriendRequestParams);

  cancel(params: CancelFriendRequestParams);

  reject(params: CancelFriendRequestParams);

  findById(id: number): Promise<FriendRequest>;

  getFriendRequests(userId: number): Promise<FriendRequest[]>;
}
