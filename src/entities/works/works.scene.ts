import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { SCENES, WIZARDS } from '../../shared/scenes-wizards';
import { BaseScene } from '../../shared/base.scene';
import { handleButtonPress } from '../../shared/helpers';
import { SceneRoles } from '../../bot/decorators/scene-roles.decorator';
import { sendMessage } from '../../shared/senMessages';

@Scene(SCENES.WORKS)
@SceneRoles('manager')
export class WorksScene extends BaseScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await sendMessage(
      ctx,
      'Заказы:',
      Markup.inlineKeyboard([
        [
          Markup.button.callback('➕ Задача', 'add_task'),
          Markup.button.callback('➕ Работа', 'add_work'),
          Markup.button.callback('📊 Работа', 'work_list'),
          Markup.button.callback('Выплата', 'work_payment'),
        ],
        [this.menuButton],
      ]),
    );
  }

  @Action('add_work')
  async onAddWork(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.WORK_ADD));
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
      await sendMessage(ctx, e.message);
    }
  }

  @Action('work_payment')
  async onWorkPayment(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.WORK_PAYMENT));
    } catch (e) {
      await sendMessage(ctx, e.message);
    }
  }
}
