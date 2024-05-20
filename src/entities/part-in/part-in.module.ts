import { PartIn } from './part-in.entity';
import { PartInService } from './part-in.service';
import { PartInAddWizard } from './part-in-add.wizard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ComponentModule } from '../component/component.module';
import { FinancialTransaction } from '../financial-transactions/financial-transaction.entity';
import { FinancialTransactionModule } from '../financial-transactions/financial-transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PartIn]),
    ComponentModule,
    FinancialTransactionModule,
  ],
  providers: [PartInService, PartInAddWizard],
  exports: [PartInService],
})
export class PartInModule {}
