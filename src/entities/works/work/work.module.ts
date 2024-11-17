import { Work } from './work.entity';
import { WorkService } from './work.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { TaskModule } from '../task/task.module';
import { WorkAddWizard } from './word-add-wizard';
import { ComponentModule } from '../../parts/component/component.module';
import { MasterModule } from '../../master/master.module';
import { StandProdModule } from '../../parts/stand-prod/stand-prod.module';
import { WorkListScene } from './work-list.scene';
import { UserModule } from '../../user/user.module';
import { Transaction } from '../../money/transaction/transaction.entity';
import { Master } from '../../master/master.entity';
import { WorkPaymentTransactionWizard } from './work-payment-transaction.wizard';
import { TransactionModule } from '../../money/transaction/transaction.module';
import { AccountModule } from '../../money/account/account.module';
import { StandProd } from '../../parts/stand-prod/stand-prod.entity';
import { PartsModule } from '../../parts/parts.module';
import { WorkShortListScene } from './work-short-list.scene';

@Module({
  imports: [
    TypeOrmModule.forFeature([Work, Transaction, Master, StandProd]),
    ComponentModule,
    TaskModule,
    forwardRef(() => StandProdModule),
    MasterModule,
    UserModule,
    TransactionModule,
    AccountModule,
    PartsModule,
  ],
  providers: [
    WorkService,
    WorkAddWizard,
    WorkListScene,
    WorkShortListScene,
    WorkPaymentTransactionWizard,
  ],
  exports: [WorkService],
})
export class WorkModule {}
