import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { TaskComponentLinkAddWizardHandler } from './task-component-link-add.wizard-handler';
import { SceneRoles } from '../../../../bot/decorators/scene-roles.decorator';
import { TaskService } from '../task.service';
import { ComponentService } from '../../../parts/component/component.service';
import { WIZARDS } from '../../../../shared/scenes-wizards';

@Wizard(WIZARDS.TASK_COMPONENT_LINK_ADD)
@SceneRoles('manager')
export class TaskComponentLinkAddWizard {
  constructor(
    @Inject(TaskService)
    readonly taskService: TaskService,
    @Inject(ComponentService)
    readonly componentService: ComponentService,
  ) {}

  @WizardStep(1)
  @TaskComponentLinkAddWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @TaskComponentLinkAddWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @TaskComponentLinkAddWizardHandler(3)
  async step3() {}
}
