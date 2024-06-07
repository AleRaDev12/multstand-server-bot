import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Money } from './money.entity';
import { MoneyService } from './money.service';
import { MoneyAddWizard } from './money-add.wizard';
import { MoneyScene } from './money.scene';
import { TransactionListScene } from './transaction-list.scene';
import { MoneyOrderAddWizard } from './add-money-order.wizard';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [TypeOrmModule.forFeature([Money]), OrderModule],
  providers: [
    MoneyService,
    MoneyAddWizard,
    MoneyScene,
    TransactionListScene,
    MoneyOrderAddWizard,
  ],
  exports: [MoneyService],
})
export class MoneyModule {}
