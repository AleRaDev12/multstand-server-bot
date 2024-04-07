import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { ClientsModule } from './entities/clients/clients.module';
import { OrdersModule } from './entities/orders/orders.module';
import { StandsModule } from './entities/stands/stands.module';
import { PartsInModule } from './entities/partsIn/partsIn.module';
import { WorksModule } from './entities/works/works.module';
import { TasksModule } from './entities/tasks/tasks.module';

@Module({
  imports: [
    ClientsModule,
    OrdersModule,
    StandsModule,
    PartsInModule,
    WorksModule,
    TasksModule,
  ],
  providers: [BotUpdate],
})
export class BotModule {}
