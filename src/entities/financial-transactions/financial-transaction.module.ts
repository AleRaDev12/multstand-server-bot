import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialTransaction } from './financial-transaction.entity';
import { FinancialTransactionService } from './financial-transaction.service';
import { FinancialTransactionAddWizard } from './financial-transaction-add.wizard';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialTransaction])],
  providers: [FinancialTransactionService, FinancialTransactionAddWizard],
  exports: [FinancialTransactionService],
})
export class FinancialTransactionModule {}
