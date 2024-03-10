import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { AddUserWizard } from './wizards/add-user.wizard';
import { BotUpdate } from '../bot.update';
import { AddOrderWizard } from '../orders/add-order.wizard';
import { OrdersService } from '../orders/orders.service';
import { OrdersController } from '../orders/orders.controller';
import { Order } from '../orders/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Order]),
  ],
  providers: [
    BotUpdate,
    UsersService,
    AddUserWizard,
    OrdersService,
    AddOrderWizard,
  ],
  controllers: [UsersController, OrdersController],
  exports: [UsersService, OrdersService],
})
export class UsersModule {}
