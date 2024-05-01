import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { ClientsModule } from '../entities/clients/clients.module';
import { OrdersModule } from '../entities/orders/orders.module';
import { StandProdModule } from '../entities/stand-prod/stand-prod.module';
import { PartInModule } from '../entities/part-in/part-in.module';
import { WorksModule } from '../entities/works/works.module';
import { TasksModule } from '../entities/tasks/tasks.module';
import { StandOrderModule } from '../entities/stand-order/stand-order.module';
import { EnteringScene } from './entering.scene';
import { PartOutModule } from '../entities/part-out/part-out.module';
import { ComponentsModule } from '../entities/components/components.module';

@Module({
  imports: [
    EnteringScene,

    ClientsModule,
    OrdersModule,
    StandProdModule,
    PartInModule,
    PartOutModule,
    WorksModule,
    TasksModule,
    StandOrderModule,
    ComponentsModule,
  ],
  providers: [BotUpdate],
})
export class BotModule {}
