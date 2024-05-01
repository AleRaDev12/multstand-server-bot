import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandOrder } from './stand-order.entity';
import { StandOrderService } from './stand-order.service';
import { StandOrderAddWizard } from './stand-order-add.wizard';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([StandOrder]), OrdersModule],
  providers: [StandOrderService, StandOrderAddWizard],
  exports: [StandOrderService],
})
export class StandOrderModule {}
