import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { WIZARDS } from '../../shared/scenes-wizards';
import { MoneyService } from './money.service';
import { MoneyAddWizardHandler } from './money-add.wizard-handler';

@Wizard(WIZARDS.ADD_MONEY)
export class MoneyAddWizard {
  constructor(
    @Inject(MoneyService)
    readonly service: MoneyService,
  ) {}

  @WizardStep(1)
  @MoneyAddWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @MoneyAddWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @MoneyAddWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @MoneyAddWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @MoneyAddWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @MoneyAddWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @MoneyAddWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @MoneyAddWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @MoneyAddWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @MoneyAddWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @MoneyAddWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @MoneyAddWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @MoneyAddWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @MoneyAddWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @MoneyAddWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @MoneyAddWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @MoneyAddWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @MoneyAddWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @MoneyAddWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @MoneyAddWizardHandler(20)
  async step20() {}
}
