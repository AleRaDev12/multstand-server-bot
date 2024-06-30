import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { WIZARDS } from '../../../shared/scenes-wizards';
import { ComponentService } from './component.service';
import { ComponentWizardHandler } from './component.wizard-handler';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';

@Wizard(WIZARDS.ADD_COMPONENT)
@SceneRoles('manager')
export class ComponentAddWizard {
  constructor(
    @Inject(ComponentService)
    private readonly service: ComponentService,
  ) {}

  @WizardStep(1)
  @ComponentWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @ComponentWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @ComponentWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @ComponentWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @ComponentWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @ComponentWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @ComponentWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @ComponentWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @ComponentWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @ComponentWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @ComponentWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @ComponentWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @ComponentWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @ComponentWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @ComponentWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @ComponentWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @ComponentWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @ComponentWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @ComponentWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @ComponentWizardHandler(20)
  async step20() {}
}
