import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { StandProdService } from './stand-prod.service';
import { Inject } from '@nestjs/common';
import { WIZARDS } from '../../shared/wizards';
import { StandProdWizardHandler } from './stand-prod.wizard-handler';
import { StandOrderService } from '../stand-order/stand-order.service';

@Wizard(WIZARDS.ADD_STAND_PROD)
export class StandProdAddWizard {
  constructor(
    @Inject(StandProdService)
    readonly service: StandProdService,
    @Inject(StandOrderService)
    readonly standOrderService: StandOrderService,
  ) {}

  @WizardStep(1)
  @StandProdWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @StandProdWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @StandProdWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @StandProdWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @StandProdWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @StandProdWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @StandProdWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @StandProdWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @StandProdWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @StandProdWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @StandProdWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @StandProdWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @StandProdWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @StandProdWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @StandProdWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @StandProdWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @StandProdWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @StandProdWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @StandProdWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @StandProdWizardHandler(20)
  async step20() {}
}
