import { OrderModule } from '../entities/orders/order/order.module';
import { StandProdModule } from '../entities/parts/stand-prod/stand-prod.module';
import { PartInModule } from '../entities/parts/part-in/part-in.module';
import { PartOutModule } from '../entities/parts/part-out/part-out.module';
import { WorkModule } from '../entities/works/work/work.module';
import { TaskModule } from '../entities/works/tasks/task.module';
import { StandOrderModule } from '../entities/orders/stand-order/stand-order.module';
import { UserModule } from '../entities/user/user.module';
import { TransactionModule } from '../entities/money/transaction/transaction.module';
import { MasterModule } from '../entities/master/master.module';
import { AccountModule } from '../entities/money/account/account.module';
import { BotUpdate } from './bot.update';
import { MenuScene } from './menu.scene';
import { RegisterUserScene } from './register-user.scene';
import { RegistrationScene } from './registrationScene';
import { OrdersScene } from '../entities/orders/orders.scene';
import { MoneyScene } from '../entities/money/money.scene';
import { Module } from '@nestjs/common';
import { ClientsModule } from '../entities/client/clients.module';
import { PartsModule } from '../entities/parts/parts.module';
import { WorksScene } from '../entities/works/works.scene';

@Module({
  imports: [
    ClientsModule,
    OrderModule,
    PartInModule,
    PartOutModule,
    WorkModule,
    TaskModule,
    StandOrderModule,
    PartsModule,
    UserModule,
    TransactionModule,
    MasterModule,
    AccountModule,
    StandProdModule,
  ],
  providers: [
    BotUpdate,
    MenuScene,
    RegisterUserScene,
    RegistrationScene,
    OrdersScene,
    MoneyScene,
    WorksScene,
  ],
})
export class BotModule {}
