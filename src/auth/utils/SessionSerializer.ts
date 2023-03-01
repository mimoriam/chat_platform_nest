import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { IUserService } from '../../users/interfaces/userInterface';
import { Services } from '../../utils/constants';
import { User } from '../../utils/typeorm';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(Services.USERS)
    private readonly userService: IUserService,
  ) {
    super();
  }

  serializeUser(user: User, done: (err: Error, user: User) => void): any {
    done(null, user);
  }
  async deserializeUser(user: User, done: CallableFunction) {
    const userDb = await this.userService.findOneUser({ id: user.id });
    return userDb ? done(null, userDb) : done(null, null);
  }
}
