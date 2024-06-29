import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { WIZARDS } from '../../../shared/scenes-wizards';
import { PartOutService } from './part-out.service';
import { PartOutWizardHandler } from './part-out-wizard.handler';
import { ComponentService } from '../component/component.service';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';

@Wizard(WIZARDS.ADD_PART_OUT)
@SceneRoles('manager')
export class PartOutAddWizard {
  constructor(
    @Inject(PartOutService)
    readonly service: PartOutService,
    @Inject(ComponentService)
    readonly componentService: ComponentService,
  ) {}

  @WizardStep(1)
  @PartOutWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @PartOutWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @PartOutWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @PartOutWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @PartOutWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @PartOutWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @PartOutWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @PartOutWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @PartOutWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @PartOutWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @PartOutWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @PartOutWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @PartOutWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @PartOutWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @PartOutWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @PartOutWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @PartOutWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @PartOutWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @PartOutWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @PartOutWizardHandler(20)
  async step20() {}
}
