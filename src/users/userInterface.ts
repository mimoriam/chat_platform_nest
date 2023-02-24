import { CreateUserDetails, FindUserParams } from '../utils/types';
import { User } from '../utils/typeorm';

export interface IUserService {
  createUser(userDetails: CreateUserDetails): Promise<User>;

  findOneUser(findUserParams: FindUserParams): Promise<User>;

  saveUser(user: User): Promise<User>;
}
