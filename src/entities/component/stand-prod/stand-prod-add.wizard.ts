import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { StandProdService } from './stand-prod.service';
import { Inject } from '@nestjs/common';
import { WIZARDS } from '../../../shared/scenes-wizards';
import { StandProdAddWizardHandler } from './stand-prod-add.wizard-handler';
import { StandOrderService } from '../../orders/stand-order/stand-order.service';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';

@Wizard(WIZARDS.ADD_STAND_PROD)
@SceneRoles('manager')
export class StandProdAddWizard {
  constructor(
    @Inject(StandProdService)
    readonly service: StandProdService,
    @Inject(StandOrderService)
    readonly standOrderService: StandOrderService,
  ) {}

  @WizardStep(1)
  @StandProdAddWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @StandProdAddWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @StandProdAddWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @StandProdAddWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @StandProdAddWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @StandProdAddWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @StandProdAddWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @StandProdAddWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @StandProdAddWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @StandProdAddWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @StandProdAddWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @StandProdAddWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @StandProdAddWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @StandProdAddWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @StandProdAddWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @StandProdAddWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @StandProdAddWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @StandProdAddWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @StandProdAddWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @StandProdAddWizardHandler(20)
  async step20() {}
}
