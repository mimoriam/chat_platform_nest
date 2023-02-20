import { Injectable } from '@nestjs/common';
import { IAuthService } from './authInterface';

@Injectable()
export class AuthService implements IAuthService {
  validateUser() {}
}
