import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { TransactionAddWizard } from './transaction-add.wizard';
import { TransactionListScene } from './transaction-list.scene';
import { OrderModule } from '../../orders/order/order.module';
import { Transaction } from './transaction.entity';
import { AccountModule } from '../account/account.module';
import { TransactionOrderAddWizard } from './transaction-order-add.wizard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    OrderModule,
    forwardRef(() => AccountModule),
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
