import { On, Wizard, WizardStep } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { TaskComponentLinkWizardHandler } from './task-component-link.wizard-handler';
import { SceneRoles } from '../../bot/decorators/scene-roles.decorator';
import { TaskService } from '../works/tasks/task.service';
import { ComponentService } from './component/component.service';
import { WIZARDS } from '../../shared/scenes-wizards';

@Wizard(WIZARDS.TASK_COMPONENT_LINK)
@SceneRoles('manager')
export class TaskComponentLinkWizard {
  constructor(
    @Inject(TaskService)
    readonly taskService: TaskService,
    @Inject(ComponentService)
    readonly componentService: ComponentService,
  ) {}

  @WizardStep(1)
  @TaskComponentLinkWizardHandler(1)
  async start() {}

  @On('text')
  @WizardStep(2)
  @TaskComponentLinkWizardHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @TaskComponentLinkWizardHandler(3)
  async step3() {}
}
