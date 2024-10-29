import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { SCENES } from '../../../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import {
  formatWithListIndexes,
  handleButtonPress,
} from '../../../../shared/helpers';
import { SceneRoles } from '../../../../bot/decorators/scene-roles.decorator';
import { sendMessage, sendMessages } from '../../../../shared/sendMessages';
import { TaskService } from '../task.service';
import { CustomSceneContext } from '../../../../shared/types';

@Scene(SCENES.TASK_COMPONENT_LINK_LIST)
@SceneRoles('manager')
export class TaskComponentListScene {
  constructor(
    @Inject(TaskService)
    readonly service: TaskService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: CustomSceneContext): Promise<void> {
    const tasksList = await this.service.taskWithComponentsFormatted(
      ctx.session.userRole,
      'line',
    );
    if (tasksList?.length === 0) {
      await sendMessage(ctx, 'Записей нет');
      return;
    }

    console.log(
      '*-* formatWithListIndexes(tasksList)',
      JSON.stringify(formatWithListIndexes(tasksList), null, 2),
    );
    await sendMessages(ctx, formatWithListIndexes(tasksList), 'line');
    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.WORKS));
  }
}
