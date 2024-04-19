import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialTransaction } from './financial-transaction.entity';
import { FinancialTransactionsService } from './financial-transactions.service';
import { FinancialTransactionsAddWizard } from './financial-transactions-add.wizard';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialTransaction])],
  providers: [FinancialTransactionsService, FinancialTransactionsAddWizard],
  exports: [FinancialTransactionsService],
})
export class FinancialTransactionsModule {}
