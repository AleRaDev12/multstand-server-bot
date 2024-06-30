import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { WIZARDS } from '../../shared/scenes-wizards';
import { ComponentService } from '../parts/component/component.service';
import { WorkService } from './work.service';
import { WorkWizardHandler } from './work.wizard-handler';
import { TaskService } from '../tasks/task.service';
import { MasterService } from '../master/master.service';
import { SceneRoles } from '../../bot/decorators/scene-roles.decorator';
import { StandProdService } from '../parts/stand-prod/stand-prod.service';

@Wizard(WIZARDS.ADD_WORK)
@SceneRoles('manager', 'master')
export class WorkAddWizard {
  constructor(
    @Inject(WorkService)
    readonly service: WorkService,
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
  @WorkWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @WorkWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @WorkWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @WorkWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @WorkWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @WorkWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @WorkWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @WorkWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @WorkWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @WorkWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @WorkWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @WorkWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @WorkWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @WorkWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @WorkWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @WorkWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @WorkWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @WorkWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @WorkWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @WorkWizardHandler(20)
  async step20() {}
}
