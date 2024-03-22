import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { ClientsModule } from './entities/clients/clients.module';
import { OrdersModule } from './entities/orders/orders.module';
import { StandsModule } from './entities/stands/stands.module';

@Module({
  imports: [ClientsModule, OrdersModule, StandsModule],
  providers: [BotUpdate],
})
export class BotModule {}
