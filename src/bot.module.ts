import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { ClientsModule } from './entities/clients/clients.module';
import { OrdersModule } from './entities/orders/orders.module';

@Module({
  imports: [ClientsModule, OrdersModule],
  providers: [BotUpdate],
})
export class BotModule {}
