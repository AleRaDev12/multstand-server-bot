import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { AccountAddWizard } from './account-add.wizard';
import { AccountListScene } from './account-list.scene';
import { TransactionModule } from '../transaction/transaction.module';
import { AccountTransferWizard } from './account-transfer.wizard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    forwardRef(() => TransactionModule),
  ],
  providers: [
    AccountService,
    AccountAddWizard,
    AccountListScene,
    AccountTransferWizard,
  ],
  exports: [AccountService],
})
export class AccountModule {}
