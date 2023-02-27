import { Module } from '@nestjs/common';
import { ExistsController } from './exists.controller';
import { ConversationsModule } from '../conversations/conversations.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConversationsModule, UsersModule],
  controllers: [ExistsController],
})
export class ExistsModule {}
