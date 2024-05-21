import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { WIZARDS } from '../../shared/scenes-wizards';
import { MoneyService } from './money.service';
import { MoneyWizardHandler } from './money.wizard-handler';

@Wizard(WIZARDS.ADD_MONEY)
export class MoneyAddWizard {
  constructor(
    @Inject(MoneyService)
    readonly service: MoneyService,
  ) {}

  @WizardStep(1)
  @MoneyWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @MoneyWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @MoneyWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @MoneyWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @MoneyWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @MoneyWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @MoneyWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @MoneyWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @MoneyWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @MoneyWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @MoneyWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @MoneyWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @MoneyWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @MoneyWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @MoneyWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @MoneyWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @MoneyWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @MoneyWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @MoneyWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @MoneyWizardHandler(20)
  async step20() {}
}
