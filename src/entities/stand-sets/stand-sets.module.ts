import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandSet } from './stand-set.entity';
import { StandSetsService } from './stand-sets.service';
import { StandSetsAddWizard } from './stand-sets-add.wizard';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([StandSet]), OrdersModule],
  providers: [StandSetsService, StandSetsAddWizard],
  exports: [StandSetsService],
})
export class StandSetsModule {}
