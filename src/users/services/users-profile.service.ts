import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../../utils/typeorm';
import { Repository } from 'typeorm';
import { IUserProfile } from '../interfaces/userProfileInterface';
import { UpdateUserProfileParams } from '../../utils/types';

@Injectable()
export class UserProfileService implements IUserProfile {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async findProfile() {
    throw new Error('Method not implemented.');
  }

  async updateProfile(params: UpdateUserProfileParams) {}
}
