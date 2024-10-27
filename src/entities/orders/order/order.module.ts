import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { ClientModule } from '../../client/client.module';
import { OrderAddWizard } from './order-add.wizard';
import { OrderListScene } from './order-list.scene';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), ClientModule],
  providers: [OrderService, OrderListScene, OrderAddWizard],
  exports: [OrderService],
})
export class OrderModule {}
