import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { ClientsModule } from './entities/clients/clients.module';
import { OrdersModule } from './entities/orders/orders.module';
import { StandsModule } from './entities/stands/stands.module';
import { PartsInModule } from './entities/partsIn/partsIn.module';
import { WorksModule } from './entities/works/works.module';

@Module({
  imports: [
    ClientsModule,
    OrdersModule,
    StandsModule,
    PartsInModule,
    WorksModule,
  ],
  providers: [BotUpdate],
})
export class BotModule {}
