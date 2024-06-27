import { ClientsModule } from '../entities/client/clients.module';
import { Module } from '@nestjs/common';
import { OrderModule } from '../entities/orders/order/order.module';
import { StandProdModule } from '../entities/component/stand-prod/stand-prod.module';
import { PartInModule } from '../entities/component/part-in/part-in.module';
import { PartOutModule } from '../entities/component/part-out/part-out.module';
import { WorkModule } from '../entities/work/work.module';
import { TaskModule } from '../entities/tasks/task.module';
import { StandOrderModule } from '../entities/orders/stand-order/stand-order.module';
import { ComponentModule } from '../entities/component/component/component.module';
import { UserModule } from '../entities/user/user.module';
import { TransactionModule } from '../entities/money/transaction/transaction.module';
import { BotUpdate } from './bot.update';
import { MenuScene } from './menu.scene';
import { RegisterUserScene } from './register-user.scene';
import { RegistrationScene } from './registrationScene';
import { OrdersScene } from '../entities/orders/orders.scene';
import { ComponentsScene } from '../entities/component/components.scene';
import { MasterModule } from '../entities/master/master.module';
import { AccountModule } from '../entities/money/account/account.module';
import { MoneyScene } from '../entities/money/money.scene';

@Module({
  imports: [
    ClientsModule,
    OrderModule,
    StandProdModule,
    PartInModule,
    PartOutModule,
    WorkModule,
    TaskModule,
    StandOrderModule,
    ComponentModule,
    UserModule,
    TransactionModule,
    MasterModule,
    AccountModule,
  ],
  providers: [
    BotUpdate,
    MenuScene,
    RegisterUserScene,
    RegistrationScene,
    ComponentsScene,
    OrdersScene,
    MoneyScene,
  ],
})
export class BotModule {}
