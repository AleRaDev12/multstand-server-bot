import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WIZARDS } from '../../shared/wizards';
import { Inject } from '@nestjs/common';
import { StandOrderService } from './stand-order.service';
import { OrdersService } from '../orders/orders.service';
import { StandOrderWizardStepHandler } from './StandOrderWizardStepHandler';

@Wizard(WIZARDS.ADD_STAND_SET)
export class StandOrderAddWizard {
  constructor(
    @Inject(StandOrderService)
    private readonly standSetsService: StandOrderService,
    @Inject(OrdersService)
    private readonly orderService: OrdersService,
  ) {}

  @WizardStep(1)
  @StandOrderWizardStepHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @StandOrderWizardStepHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @StandOrderWizardStepHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @StandOrderWizardStepHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @StandOrderWizardStepHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @StandOrderWizardStepHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @StandOrderWizardStepHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @StandOrderWizardStepHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @StandOrderWizardStepHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @StandOrderWizardStepHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @StandOrderWizardStepHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @StandOrderWizardStepHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @StandOrderWizardStepHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @StandOrderWizardStepHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @StandOrderWizardStepHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @StandOrderWizardStepHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @StandOrderWizardStepHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @StandOrderWizardStepHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @StandOrderWizardStepHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @StandOrderWizardStepHandler(20)
  async step20() {}
}
