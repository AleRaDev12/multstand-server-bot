import { ClientsModule } from '../entities/client/clients.module';
import { Module } from '@nestjs/common';
import { OrderModule } from '../entities/orders/order/order.module';
import { StandProdModule } from '../entities/component/stand-prod/stand-prod.module';
import { PartInModule } from '../entities/component/part-in/part-in.module';
import { PartOutModule } from '../entities/component/part-out/part-out.module';
import { WorkModule } from '../entities/work/work.module';
import { TasksModule } from '../entities/tasks/tasks.module';
import { StandOrderModule } from '../entities/orders/stand-order/stand-order.module';
import { ComponentModule } from '../entities/component/component/component.module';
import { UserModule } from '../entities/user/user.module';
import { MoneyModule } from '../entities/money/money.module';
import { BotUpdate } from './bot.update';
import { MenuScene } from './menu.scene';
import { RegisterUserScene } from './register-user.scene';
import { UnregisteredScene } from './unregistered.scene';
import { OrdersScene } from '../entities/orders/orders.scene';
import { ComponentsScene } from '../entities/component/components.scene';
import { MasterModule } from '../entities/master/master.module';

@Module({
  imports: [
    ClientsModule,
    OrderModule,
    StandProdModule,
    PartInModule,
    PartOutModule,
    WorkModule,
    TasksModule,
    StandOrderModule,
    ComponentModule,
    UserModule,
    MoneyModule,
    MasterModule,
  ],
  providers: [
    BotUpdate,
    MenuScene,
    RegisterUserScene,
    UnregisteredScene,
    ComponentsScene,
    OrdersScene,
  ],
})
export class BotModule {}
