import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { ClientsModule } from '../entities/client/clients.module';
import { OrderModule } from '../entities/order/order.module';
import { StandProdModule } from '../entities/stand/stand-prod/stand-prod.module';
import { PartInModule } from '../entities/component/part-in/part-in.module';
import { WorkModule } from '../entities/work/work.module';
import { TasksModule } from '../entities/tasks/tasks.module';
import { StandOrderModule } from '../entities/stand/stand-order/stand-order.module';
import { MenuScene } from './menu.scene';
import { PartOutModule } from '../entities/component/part-out/part-out.module';
import { ComponentModule } from '../entities/component/component/component.module';
import { RegisterUserScene } from './register-user.scene';
import { UnregisteredScene } from './unregistered.scene';
import { UserModule } from '../entities/user/user.module';

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
  ],
  providers: [BotUpdate, MenuScene, RegisterUserScene, UnregisteredScene],
})
export class BotModule {}
