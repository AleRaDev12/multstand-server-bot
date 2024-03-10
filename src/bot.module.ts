import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [UsersModule, OrdersModule],
  providers: [BotUpdate],
})
export class BotModule {}
