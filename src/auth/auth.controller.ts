import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { Routes, Services } from '../utils/constants';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { IAuthService } from './authInterface';
import { IUserService } from '../users/userInterface';
import { instanceToPlain } from 'class-transformer';
import { LocalAuthGuard } from './utils/Guards';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private authService: IAuthService,
    @Inject(Services.USERS) private userService: IUserService,
  ) {}

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    // We use instanceToPlain to exclude passwords from being sent:
    return instanceToPlain(await this.userService.createUser(createUserDto));
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login() {}

  @Get('status')
  status() {}

  @Post('logout')
  logout() {}
}
