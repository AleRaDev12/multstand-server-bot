import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { WIZARDS } from '../../../shared/scenes-wizards';
import { PartOutService } from './part-out.service';
import { PartOutAddWizardHandler } from './part-out-add.wizard.handler';
import { ComponentService } from '../component/component.service';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';
import { PartsService } from '../parts.service';
import { StandProdService } from '../stand-prod/stand-prod.service';

@Wizard(WIZARDS.ADD_PART_OUT)
@SceneRoles('manager')
export class PartOutAddWizard {
  constructor(
    @Inject(PartOutService)
    readonly service: PartOutService,
    @Inject(ComponentService)
    readonly componentService: ComponentService,
    @Inject(PartsService)
    readonly partsService: PartsService,
    @Inject(StandProdService)
    readonly standProdService: StandProdService,
  ) {}

  @WizardStep(1)
  @PartOutAddWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @PartOutAddWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @PartOutAddWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @PartOutAddWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @PartOutAddWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @PartOutAddWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @PartOutAddWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @PartOutAddWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @PartOutAddWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @PartOutAddWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @PartOutAddWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @PartOutAddWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @PartOutAddWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @PartOutAddWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @PartOutAddWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @PartOutAddWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @PartOutAddWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @PartOutAddWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @PartOutAddWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @PartOutAddWizardHandler(20)
  async step20() {}
}
