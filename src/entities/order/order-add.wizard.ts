import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { OrderService } from './order.service';
import { ClientService } from '../clients/client.service';
import { Inject } from '@nestjs/common';
import { WIZARDS } from '../../shared/wizards';
import { OrderWizardHandler } from './order.wizard-handler';

@Wizard(WIZARDS.ORDER_ADD)
export class OrderAddWizard {
  constructor(
    @Inject(OrderService)
    private readonly service: OrderService,
    @Inject(ClientService)
    readonly clientService: ClientService,
  ) {}

  @WizardStep(1)
  @OrderWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @OrderWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @OrderWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @OrderWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @OrderWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @OrderWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @OrderWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @OrderWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @OrderWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @OrderWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @OrderWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @OrderWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @OrderWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @OrderWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @OrderWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @OrderWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @OrderWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @OrderWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @OrderWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @OrderWizardHandler(20)
  async step20() {}
}
