import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { SCENES_WIZARDS } from '../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { StandOrderService } from './stand-order.service';
import { OrderService } from '../order/order.service';
import { StandOrderWizardHandler } from './stand-order.wizard-handler';

@Wizard(SCENES_WIZARDS.ADD_STAND_ORDER)
export class StandOrderAddWizard {
  constructor(
    @Inject(StandOrderService)
    readonly service: StandOrderService,
    @Inject(OrderService)
    readonly orderService: OrderService,
  ) {}

  @WizardStep(1)
  @StandOrderWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @StandOrderWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @StandOrderWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @StandOrderWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @StandOrderWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @StandOrderWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @StandOrderWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @StandOrderWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @StandOrderWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @StandOrderWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @StandOrderWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @StandOrderWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @StandOrderWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @StandOrderWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @StandOrderWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @StandOrderWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @StandOrderWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @StandOrderWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @StandOrderWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @StandOrderWizardHandler(20)
  async step20() {}
}
