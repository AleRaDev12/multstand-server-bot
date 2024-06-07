import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { WIZARDS } from '../../shared/scenes-wizards';
import { MoneyService } from './money.service';
import { MoneyOrderWizardHandler } from './add-money-order.wizard-handler';
import { OrderService } from '../order/order.service';

@Wizard(WIZARDS.ADD_MONEY_ORDER)
export class MoneyOrderAddWizard {
  constructor(
    @Inject(MoneyService)
    readonly service: MoneyService,
    @Inject(OrderService)
    readonly orderService: OrderService,
  ) {}

  @WizardStep(1)
  @MoneyOrderWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @MoneyOrderWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @MoneyOrderWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @MoneyOrderWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @MoneyOrderWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @MoneyOrderWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @MoneyOrderWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @MoneyOrderWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @MoneyOrderWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @MoneyOrderWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @MoneyOrderWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @MoneyOrderWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @MoneyOrderWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @MoneyOrderWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @MoneyOrderWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @MoneyOrderWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @MoneyOrderWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @MoneyOrderWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @MoneyOrderWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @MoneyOrderWizardHandler(20)
  async step20() {}
}
