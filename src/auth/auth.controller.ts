import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Routes, Services } from '../utils/types';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { IAuthService } from './authInterface';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(@Inject(Services.AUTH) private authService: IAuthService) {}

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {}

  @Post('login')
  login() {}

  @Get('status')
  status() {}

  @Post('logout')
  logout() {}
}
