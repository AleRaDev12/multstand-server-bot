import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { WIZARDS } from '../../shared/wizards';
import { ComponentsService } from './components.service';
import { ComponentsWizardHandler } from './components.wizard-handler';

@Wizard(WIZARDS.ADD_COMPONENT)
export class ComponentsAddWizard {
  constructor(
    @Inject(ComponentsService)
    private readonly service: ComponentsService,
  ) {}

  @WizardStep(1)
  @ComponentsWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @ComponentsWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @ComponentsWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @ComponentsWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @ComponentsWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @ComponentsWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @ComponentsWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @ComponentsWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @ComponentsWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @ComponentsWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @ComponentsWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @ComponentsWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @ComponentsWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @ComponentsWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @ComponentsWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @ComponentsWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @ComponentsWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @ComponentsWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @ComponentsWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @ComponentsWizardHandler(20)
  async step20() {}
}
