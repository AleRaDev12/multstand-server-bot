import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { OrderService } from './order.service';
import { ClientService } from '../../client/client.service';
import { Inject } from '@nestjs/common';
import { WIZARDS } from '../../../shared/scenes-wizards';
import { OrderAddWizardHandler } from './order-add.wizard-handler';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';

@Wizard(WIZARDS.ORDER_ADD)
@SceneRoles('manager')
export class OrderAddWizard {
  constructor(
    @Inject(OrderService)
    readonly service: OrderService,
    @Inject(ClientService)
    readonly clientService: ClientService,
  ) {}

  @WizardStep(1)
  @OrderAddWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @OrderAddWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @OrderAddWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @OrderAddWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @OrderAddWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @OrderAddWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @OrderAddWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @OrderAddWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @OrderAddWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @OrderAddWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @OrderAddWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @OrderAddWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @OrderAddWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @OrderAddWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @OrderAddWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @OrderAddWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @OrderAddWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @OrderAddWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @OrderAddWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @OrderAddWizardHandler(20)
  async step20() {}
}
