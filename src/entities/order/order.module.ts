import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { ClientsModule } from '../clients/clients.module';
import { OrderAddWizard } from './order-add.wizard';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), ClientsModule],
  providers: [OrderService, OrderAddWizard],
  exports: [OrderService],
})
export class OrderModule {}
