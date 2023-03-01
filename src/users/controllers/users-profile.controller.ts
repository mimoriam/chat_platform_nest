import {
  Body,
  Controller,
  Inject,
  Patch,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Routes, Services, UserProfileFileFields } from '../../utils/constants';
import { IUserProfile } from '../interfaces/userProfileInterface';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateUserProfileParams, UserProfileFiles } from '../../utils/types';
import { UpdateUserProfileDto } from '../dtos/UpdateUserProfile.dto';

@Controller(Routes.USERS_PROFILES)
export class UserProfilesController {
  constructor(
    @Inject(Services.USERS_PROFILES)
    private readonly userProfileService: IUserProfile,
  ) {}

  @Patch()
  @UseInterceptors(FileFieldsInterceptor(UserProfileFileFields))
  async updateUserProfile(
    @UploadedFiles()
    files: UserProfileFiles,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    const params: UpdateUserProfileParams = {};
    updateUserProfileDto.about && (params.about = updateUserProfileDto.about);
    files.banner && (params.banner = files.banner[0]);
    files.avatar && (params.avatar = files.avatar[0]);
    await this.userProfileService.updateProfile(params);
  }
}
