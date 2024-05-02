import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { ClientsModule } from '../entities/clients/clients.module';
import { OrderModule } from '../entities/order/order.module';
import { StandProdModule } from '../entities/stand-prod/stand-prod.module';
import { PartInModule } from '../entities/part-in/part-in.module';
import { WorksModule } from '../entities/works/works.module';
import { TasksModule } from '../entities/tasks/tasks.module';
import { StandOrderModule } from '../entities/stand-order/stand-order.module';
import { EnteringScene } from './entering.scene';
import { PartOutModule } from '../entities/part-out/part-out.module';
import { ComponentModule } from '../entities/component/component.module';

@Module({
  imports: [
    EnteringScene,

    ClientsModule,
    OrderModule,
    StandProdModule,
    PartInModule,
    PartOutModule,
    WorksModule,
    TasksModule,
    StandOrderModule,
    ComponentModule,
  ],
  providers: [BotUpdate],
})
export class BotModule {}
