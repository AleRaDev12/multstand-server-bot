import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { WIZARDS } from '../../../shared/scenes-wizards';
import { WorkService } from './work.service';
import { MasterService } from '../../master/master.service';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';
import { TransactionService } from '../../money/transaction/transaction.service';
import { WorkPaymentTransactionWizardHandler } from './work-payment-transaction.wizard-handler';
import { AccountService } from '../../money/account/account.service';

@Wizard(WIZARDS.WORK_PAYMENT)
@SceneRoles('manager')
export class WorkPaymentTransactionWizard {
  constructor(
    @Inject(WorkService)
    readonly service: WorkService,
    @Inject(MasterService)
    readonly masterService: MasterService,
    @Inject(TransactionService)
    readonly transactionService: TransactionService,
    @Inject(AccountService)
    readonly accountService: AccountService,
  ) {}

  @WizardStep(1)
  @WorkPaymentTransactionWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @WorkPaymentTransactionWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @WorkPaymentTransactionWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @WorkPaymentTransactionWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @WorkPaymentTransactionWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @WorkPaymentTransactionWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @WorkPaymentTransactionWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @WorkPaymentTransactionWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @WorkPaymentTransactionWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @WorkPaymentTransactionWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @WorkPaymentTransactionWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @WorkPaymentTransactionWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @WorkPaymentTransactionWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @WorkPaymentTransactionWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @WorkPaymentTransactionWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @WorkPaymentTransactionWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @WorkPaymentTransactionWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @WorkPaymentTransactionWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @WorkPaymentTransactionWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @WorkPaymentTransactionWizardHandler(20)
  async step20() {}
}
