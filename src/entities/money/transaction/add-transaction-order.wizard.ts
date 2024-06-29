import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { WIZARDS } from '../../../shared/scenes-wizards';
import { TransactionService } from './transaction.service';
import { OrderService } from '../../orders/order/order.service';
import { AccountService } from '../account/account.service';
import { TransactionOrderWizardHandler } from './add-transaction-order.wizard-handler';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';

@Wizard(WIZARDS.ADD_TRANSACTION_ORDER)
@SceneRoles('manager')
export class TransactionOrderAddWizard {
  constructor(
    @Inject(TransactionService)
    readonly service: TransactionService,
    @Inject(OrderService)
    readonly orderService: OrderService,
    @Inject(AccountService)
    readonly accountService: AccountService,
  ) {}

  @WizardStep(1)
  @TransactionOrderWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @TransactionOrderWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @TransactionOrderWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @TransactionOrderWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @TransactionOrderWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @TransactionOrderWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @TransactionOrderWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @TransactionOrderWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @TransactionOrderWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @TransactionOrderWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @TransactionOrderWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @TransactionOrderWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @TransactionOrderWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @TransactionOrderWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @TransactionOrderWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @TransactionOrderWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @TransactionOrderWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @TransactionOrderWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @TransactionOrderWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @TransactionOrderWizardHandler(20)
  async step20() {}
}
