import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { WIZARDS } from '../../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { StandOrderService } from './stand-order.service';
import { StandOrderAddWizardHandler } from './stand-order-add.wizard-handler';
import { OrderService } from '../order/order.service';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';

@Wizard(WIZARDS.ADD_STAND_ORDER)
@SceneRoles('manager')
export class StandOrderAddWizard {
  constructor(
    @Inject(StandOrderService)
    readonly service: StandOrderService,
    @Inject(OrderService)
    readonly orderService: OrderService,
  ) {}

  @WizardStep(1)
  @StandOrderAddWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @StandOrderAddWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @StandOrderAddWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @StandOrderAddWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @StandOrderAddWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @StandOrderAddWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @StandOrderAddWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @StandOrderAddWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @StandOrderAddWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @StandOrderAddWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @StandOrderAddWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @StandOrderAddWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @StandOrderAddWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @StandOrderAddWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @StandOrderAddWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @StandOrderAddWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @StandOrderAddWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @StandOrderAddWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @StandOrderAddWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @StandOrderAddWizardHandler(20)
  async step20() {}
}
