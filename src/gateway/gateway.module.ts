import { Module } from '@nestjs/common';
import { MessagingGateway } from './gateway.gateway';

@Module({
  providers: [MessagingGateway],
})
export class GatewayModule {}
