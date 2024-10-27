import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { TaskService } from '../task.service';
import { Inject } from '@nestjs/common';
import { WIZARDS } from '../../../../shared/scenes-wizards';
import { TaskWizardHandler } from './task-add.wizard-handler';
import { SceneRoles } from '../../../../bot/decorators/scene-roles.decorator';

@Wizard(WIZARDS.ADD_TASK)
@SceneRoles('manager')
export class TaskAddWizard {
  constructor(
    @Inject(TaskService)
    private readonly service: TaskService,
  ) {}

  @WizardStep(1)
  @TaskWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @TaskWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @TaskWizardHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @TaskWizardHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @TaskWizardHandler(5)
  async step5() {}

  @On('text')
  @WizardStep(6)
  @TaskWizardHandler(6)
  async step6() {}

  @On('text')
  @WizardStep(7)
  @TaskWizardHandler(7)
  async step7() {}

  @On('text')
  @WizardStep(8)
  @TaskWizardHandler(8)
  async step8() {}

  @On('text')
  @WizardStep(9)
  @TaskWizardHandler(9)
  async step9() {}

  @On('text')
  @WizardStep(10)
  @TaskWizardHandler(10)
  async step10() {}

  @On('text')
  @WizardStep(11)
  @TaskWizardHandler(11)
  async step11() {}

  @On('text')
  @WizardStep(12)
  @TaskWizardHandler(12)
  async step12() {}

  @On('text')
  @WizardStep(13)
  @TaskWizardHandler(13)
  async step13() {}

  @On('text')
  @WizardStep(14)
  @TaskWizardHandler(14)
  async step14() {}

  @On('text')
  @WizardStep(15)
  @TaskWizardHandler(15)
  async step15() {}

  @On('text')
  @WizardStep(16)
  @TaskWizardHandler(16)
  async step16() {}

  @On('text')
  @WizardStep(17)
  @TaskWizardHandler(17)
  async step17() {}

  @On('text')
  @WizardStep(18)
  @TaskWizardHandler(18)
  async step18() {}

  @On('text')
  @WizardStep(19)
  @TaskWizardHandler(19)
  async step19() {}

  @On('text')
  @WizardStep(20)
  @TaskWizardHandler(20)
  async step20() {}
}
