import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { SCENES, WIZARDS } from '../../shared/scenes-wizards';
import { BaseScene } from '../../shared/base.scene';
import { handleButtonPress } from '../../shared/helpers';
import { SceneRoles } from '../../bot/decorators/scene-roles.decorator';

@Scene(SCENES.WORKS)
@SceneRoles('manager')
export class WorksScene extends BaseScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.reply(
      'Заказы:',
      Markup.inlineKeyboard([
        [
          Markup.button.callback('➕ Задача', 'add_task'),
          Markup.button.callback('➕ Работа', 'add_work'),
          Markup.button.callback('📊 Работа', 'work_list'),
        ],
        [this.menuButton],
      ]),
    );
  }

  @Action('add_work')
  async onAddWork(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_WORK));
  }

  @Action('add_task')
  async onAddTask(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_TASK));
  }

  @Action('work_list')
  async onWorkList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.WORK_LIST));
    } catch (e) {
      await ctx.reply(e.message);
    }
  }
}
