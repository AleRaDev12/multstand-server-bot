import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { ClientsModule } from '../clients/clients.module';
import { OrderAddWizard } from './orderAdd.wizard';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), ClientsModule],
  providers: [OrdersService, OrderAddWizard],
  exports: [OrdersService],
})
export class OrdersModule {}
