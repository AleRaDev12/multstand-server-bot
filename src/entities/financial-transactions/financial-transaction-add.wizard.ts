import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { WIZARDS } from '../../shared/wizards';
import { FinancialTransactionService } from './financial-transaction.service';
import { FinancialTransactionWizardHandler } from './financial-transaction.wizard-handler';

@Wizard(WIZARDS.ADD_FINANCIAL_TRANSACTION)
export class FinancialTransactionAddWizard {
  constructor(
    @Inject(FinancialTransactionService)
    readonly service: FinancialTransactionService,
  ) {}

  @WizardStep(1)
  @FinancialTransactionWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @FinancialTransactionWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @FinancialTransactionWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @FinancialTransactionWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @FinancialTransactionWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @FinancialTransactionWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @FinancialTransactionWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @FinancialTransactionWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @FinancialTransactionWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @FinancialTransactionWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @FinancialTransactionWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @FinancialTransactionWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @FinancialTransactionWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @FinancialTransactionWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @FinancialTransactionWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @FinancialTransactionWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @FinancialTransactionWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @FinancialTransactionWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @FinancialTransactionWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @FinancialTransactionWizardHandler(20)
  async step20() {}
}
