import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { ClientsModule } from '../client/clients.module';
import { OrderAddWizard } from './order-add.wizard';
import { OrderScene } from './order.scene';
import { OrderListScene } from './order-list.scene';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), ClientsModule],
  providers: [OrderService, OrderScene, OrderListScene, OrderAddWizard],
  exports: [OrderService],
})
export class OrderModule {}
