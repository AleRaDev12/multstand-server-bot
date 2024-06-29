import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandOrder } from './stand-order.entity';
import { StandOrderService } from './stand-order.service';
import { StandOrderAddWizard } from './stand-order-add.wizard';
import { StandOrderListScene } from './lists/stand-order-list.scene';
import { OrderModule } from '../order/order.module';
import { StandOrderActiveListScene } from './lists/stand-order-active-list.scene';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([StandOrder]), OrderModule, UserModule],
  providers: [
    StandOrderService,
    StandOrderAddWizard,
    StandOrderListScene,
    StandOrderActiveListScene,
  ],
  exports: [StandOrderService],
})
export class StandOrderModule {}
