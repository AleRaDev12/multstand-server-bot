import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandOrder } from './stand-order.entity';
import { StandOrderService } from './stand-order.service';
import { StandOrderAddWizard } from './stand-order-add.wizard';
import { StandOrderListScene } from './stand-order-list.scene';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [TypeOrmModule.forFeature([StandOrder]), OrderModule],
  providers: [StandOrderService, StandOrderAddWizard, StandOrderListScene],
  exports: [StandOrderService],
})
export class StandOrderModule {}
