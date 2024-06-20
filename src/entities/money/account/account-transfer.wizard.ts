import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WIZARDS } from '../../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountTransferWizardHandler } from './account-transfer.wizard-handler';

@Wizard(WIZARDS.ACCOUNT_TRANSFER)
export class AccountTransferWizard {
  constructor(
    @Inject(AccountService)
    readonly service: AccountService,
  ) {}

  @WizardStep(1)
  @AccountTransferWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @AccountTransferWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @AccountTransferWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @AccountTransferWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @AccountTransferWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @AccountTransferWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @AccountTransferWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @AccountTransferWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @AccountTransferWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @AccountTransferWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @AccountTransferWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @AccountTransferWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @AccountTransferWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @AccountTransferWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @AccountTransferWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @AccountTransferWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @AccountTransferWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @AccountTransferWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @AccountTransferWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @AccountTransferWizardHandler(20)
  async step20() {}
}
