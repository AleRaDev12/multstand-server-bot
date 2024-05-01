import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { ClientsModule } from './entities/clients/clients.module';
import { OrdersModule } from './entities/orders/orders.module';
import { StandProdModule } from './entities/stand-prod/stand-prod.module';
import { PartInModule } from './entities/part-in/part-in.module';
import { WorksModule } from './entities/works/works.module';
import { TasksModule } from './entities/tasks/tasks.module';
import { StandOrderModule } from './entities/stand-order/stand-order.module';
import { MainScene } from './main.scene';

@Module({
  imports: [
    ClientsModule,
    OrdersModule,
    StandProdModule,
    PartInModule,
    WorksModule,
    TasksModule,
    StandOrderModule,
    MainScene,
  ],
  providers: [BotUpdate],
})
export class BotModule {}
