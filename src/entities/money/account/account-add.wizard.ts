import { AccountService } from './account.service';
import { WIZARDS } from '../../../shared/scenes-wizards';
import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { AccountAddWizardHandler } from './account-add.wizard-handler';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';

@Wizard(WIZARDS.ADD_ACCOUNT)
@SceneRoles('manager')
export class AccountAddWizard {
  constructor(
    @Inject(AccountService)
    readonly service: AccountService,
  ) {}

  @WizardStep(1)
  @AccountAddWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @AccountAddWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @AccountAddWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @AccountAddWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @AccountAddWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @AccountAddWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @AccountAddWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @AccountAddWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @AccountAddWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @AccountAddWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @AccountAddWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @AccountAddWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @AccountAddWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @AccountAddWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @AccountAddWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @AccountAddWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @AccountAddWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @AccountAddWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @AccountAddWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @AccountAddWizardHandler(20)
  async step20() {}
}
