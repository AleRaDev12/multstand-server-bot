import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { WIZARDS } from '../../../shared/scenes-wizards';
import { PartInService } from './part-in.service';
import { PartInWizardHandler } from './part-in.wizard-handler';
import { ComponentService } from '../component/component.service';
import { MoneyService } from '../../money/money.service';

@Wizard(WIZARDS.ADD_PART_IN)
export class PartInAddWizard {
  constructor(
    @Inject(PartInService)
    readonly service: PartInService,
    @Inject(ComponentService)
    readonly componentService: ComponentService,
    @Inject(MoneyService)
    readonly moneyService: MoneyService,
  ) {}

  @WizardStep(1)
  @PartInWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @PartInWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @PartInWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @PartInWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @PartInWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @PartInWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @PartInWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @PartInWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @PartInWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @PartInWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @PartInWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @PartInWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @PartInWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @PartInWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @PartInWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @PartInWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @PartInWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @PartInWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @PartInWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @PartInWizardHandler(20)
  async step20() {}
}
