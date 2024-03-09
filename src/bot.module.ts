import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  providers: [BotUpdate, UsersModule, OrdersModule],
})
export class BotModule {}
