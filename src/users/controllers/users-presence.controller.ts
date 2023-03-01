import { Body, Controller, Inject, Patch, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../../auth/utils/Guards';
import { Routes, Services } from '../../utils/constants';
import { AuthUser } from '../../utils/decorators';
import { User } from '../../utils/typeorm';
import { IUserPresenceService } from '../interfaces/userPresenceInterface';
import { UpdatePresenceStatusDto } from '../dtos/UpdatePresence.dto';

@UseGuards(AuthenticatedGuard)
@Controller(Routes.USER_PRESENCE)
export class UserPresenceController {
  constructor(
    @Inject(Services.USER_PRESENCE)
    private readonly userPresenceService: IUserPresenceService,
  ) {}

  @Patch('status')
  updateStatus(
    @AuthUser() user: User,
    @Body() { statusMessage }: UpdatePresenceStatusDto,
  ) {
    return this.userPresenceService.updateStatus({ user, statusMessage });
  }
}
