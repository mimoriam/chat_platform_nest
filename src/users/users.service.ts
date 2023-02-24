import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUserService } from './userInterface';
import { CreateUserDetails, FindUserParams } from '../utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../utils/typeorm';
import { Repository } from 'typeorm';
import { hashPassword } from '../utils/helpers';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(userDetails: CreateUserDetails) {
    const existingUser = await this.userRepository.findOne({
      where: { email: userDetails.email },
    });

    if (existingUser)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);

    const password = await hashPassword(userDetails.password);
    const newUser = this.userRepository.create({ ...userDetails, password });
    return this.userRepository.save(newUser);
  }

  async findOneUser(findUserParams: FindUserParams): Promise<User> {
    return this.userRepository.findOne({
      where: findUserParams,
      relations: { participant: true },
    });
  }

  async saveUser(user: User) {
    return this.userRepository.save(user);
  }
}
