import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Money } from './money.entity';
import { MoneyService } from './money.service';
import { MoneyAddWizard } from './money-add.wizard';
import { MoneyScene } from './money.scene';
import { TransactionListScene } from './transaction-list.scene';

@Module({
  imports: [TypeOrmModule.forFeature([Money])],
  providers: [MoneyService, MoneyAddWizard, MoneyScene, TransactionListScene],
  exports: [MoneyService],
})
export class MoneyModule {}
