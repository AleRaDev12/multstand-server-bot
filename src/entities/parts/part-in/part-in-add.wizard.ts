import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { WIZARDS } from '../../../shared/scenes-wizards';
import { PartInService } from './part-in.service';
import { PartInAddWizardHandler } from './part-in-add.wizard-handler';
import { ComponentService } from '../component/component.service';
import { TransactionService } from '../../money/transaction/transaction.service';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';
import { AccountService } from '../../money/account/account.service';

@Wizard(WIZARDS.ADD_PART_IN)
@SceneRoles('manager')
export class PartInAddWizard {
  constructor(
    @Inject(PartInService)
    readonly service: PartInService,
    @Inject(ComponentService)
    readonly componentService: ComponentService,
    @Inject(TransactionService)
    readonly transactionService: TransactionService,
    @Inject(AccountService)
    readonly accountService: AccountService,
  ) {}

  @WizardStep(1)
  @PartInAddWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @PartInAddWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @PartInAddWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @PartInAddWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @PartInAddWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @PartInAddWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @PartInAddWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @PartInAddWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @PartInAddWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @PartInAddWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @PartInAddWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @PartInAddWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @PartInAddWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @PartInAddWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @PartInAddWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @PartInAddWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @PartInAddWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @PartInAddWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @PartInAddWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @PartInAddWizardHandler(20)
  async step20() {}
}
