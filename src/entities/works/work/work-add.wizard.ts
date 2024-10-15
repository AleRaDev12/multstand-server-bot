import { InjectBot, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { WIZARDS } from '../../../shared/scenes-wizards';
import { ComponentService } from '../../parts/component/component.service';
import { WorkService } from './work.service';
import { WorkAddWizardHandler } from './work-add.wizard-handler';
import { TaskService } from '../tasks/task.service';
import { MasterService } from '../../master/master.service';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';
import { StandProdService } from '../../parts/stand-prod/stand-prod.service';
import { Telegraf } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { UserService } from 'src/entities/user/user.service';

@Wizard(WIZARDS.WORK_ADD)
@SceneRoles('manager', 'master')
export class WorkAddWizard {
  constructor(
    @InjectBot()
    readonly bot: Telegraf<SceneContext>,
    @Inject(WorkService)
    readonly service: WorkService,
    @Inject(UserService)
    readonly userService: UserService,
    @Inject(MasterService)
    readonly masterService: MasterService,
    @Inject(ComponentService)
    readonly componentService: ComponentService,
    @Inject(TaskService)
    readonly taskService: TaskService,
    @Inject(StandProdService)
    readonly standProdService: StandProdService,
  ) {}

  @WizardStep(1)
  @WorkAddWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @WorkAddWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @WorkAddWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @WorkAddWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @WorkAddWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @WorkAddWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @WorkAddWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @WorkAddWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @WorkAddWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @WorkAddWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @WorkAddWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @WorkAddWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @WorkAddWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @WorkAddWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @WorkAddWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @WorkAddWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @WorkAddWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @WorkAddWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @WorkAddWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @WorkAddWizardHandler(20)
  async step20() {}
}
