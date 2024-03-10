import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity';
import { UsersModule } from '../users/users.module';
import { AddOrderWizard } from './add-order.wizard';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), UsersModule],
  providers: [OrdersService, AddOrderWizard],
  controllers: [OrdersController],
})
export class OrdersModule {}
