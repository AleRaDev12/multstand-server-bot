import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { TransactionAddWizard } from './transaction-add.wizard';
import { TransactionListScene } from './transaction-list.scene';
import { OrderModule } from '../../orders/order/order.module';
import { Transaction } from './transaction.entity';
import { TransactionOrderAddWizard } from './add-transaction-order.wizard';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    OrderModule,
    AccountModule,
  ],
  providers: [
    TransactionService,
    TransactionAddWizard,
    TransactionOrderAddWizard,
    TransactionListScene,
  ],
  exports: [TransactionService],
})
export class TransactionModule {}
