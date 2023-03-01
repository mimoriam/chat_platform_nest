import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './authInterface';
import { Services } from '../utils/constants';
import { IUserService } from '../users/interfaces/userInterface';
import { ValidateUserDetails } from '../utils/types';
import { compareHash } from '../utils/helpers';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUserService,
  ) {}

  async validateUser(userDetails: ValidateUserDetails) {
    const user = await this.userService.findOneUser(
      {
        username: userDetails.username,
      },
      { selectAll: true },
    );
    if (!user)
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    const isPasswordValid = await compareHash(
      userDetails.password,
      user.password,
    );
    return isPasswordValid ? user : null;
  }
}
