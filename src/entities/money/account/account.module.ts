import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { AccountAddWizard } from './account-add.wizard';
import { AccountListScene } from './account-list.scene';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountService, AccountAddWizard, AccountListScene],
  exports: [AccountService],
})
export class AccountModule {}
