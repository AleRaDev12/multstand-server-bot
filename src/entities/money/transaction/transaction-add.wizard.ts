import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { WIZARDS } from '../../../shared/scenes-wizards';
import { TransactionService } from './transaction.service';
import { TransactionAddWizardHandler } from './transaction-add.wizard-handler';
import { AccountService } from '../account/account.service';

@Wizard(WIZARDS.ADD_TRANSACTION)
export class TransactionAddWizard {
  constructor(
    @Inject(TransactionService)
    readonly service: TransactionService,
    @Inject(AccountService)
    readonly accountService: AccountService,
  ) {}

  @WizardStep(1)
  @TransactionAddWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @TransactionAddWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @TransactionAddWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @TransactionAddWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @TransactionAddWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @TransactionAddWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @TransactionAddWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @TransactionAddWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @TransactionAddWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @TransactionAddWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @TransactionAddWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @TransactionAddWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @TransactionAddWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @TransactionAddWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @TransactionAddWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @TransactionAddWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @TransactionAddWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @TransactionAddWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @TransactionAddWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @TransactionAddWizardHandler(20)
  async step20() {}
}
