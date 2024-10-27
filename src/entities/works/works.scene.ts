import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { SCENES, WIZARDS } from '../../shared/scenes-wizards';
import { BaseScene } from '../../shared/base.scene';
import { handleButtonPress } from '../../shared/helpers';
import { SceneRoles } from '../../bot/decorators/scene-roles.decorator';
import { sendMessage } from '../../shared/sendMessages';

enum Actions {
  TASK_LIST = 'TASK_LIST',
  TASK_ADD = 'TASK_ADD',
  WORK_LIST = 'WORK_LIST',
  WORK_ADD = 'WORK_ADD',
  WORK_PAYMENT = 'WORK_PAYMENT',
  TASK_COMPONENT_LINK_LIST = 'TASK_COMPONENT_LINK_LIST',
  TASK_COMPONENT_LINK_ADD = 'TASK_COMPONENT_LINK_ADD',
}

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
          Markup.button.callback('📊 Задачи', Actions.TASK_LIST),
          Markup.button.callback('➕', Actions.TASK_ADD),
        ],
        [
          Markup.button.callback('📊 Работа', Actions.WORK_LIST),
          Markup.button.callback('➕', Actions.WORK_ADD),
        ],
        [Markup.button.callback('➕ Выплата', Actions.WORK_PAYMENT)],
        [
          Markup.button.callback(
            '📑 Компоненты-задачи',
            Actions.TASK_COMPONENT_LINK_LIST,
          ),
          Markup.button.callback('Связать', Actions.TASK_COMPONENT_LINK_ADD),
        ],
        [this.menuButton],
      ]),
    );
  }

  @Action(Actions.WORK_ADD)
  async onAddWork(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.WORK_ADD));
  }

  @Action(Actions.TASK_ADD)
  async onAddTask(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_TASK));
  }

  @Action(Actions.WORK_LIST)
  async onWorkList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.WORK_LIST));
    } catch (e) {
      await sendMessage(ctx, e.message);
    }
  }

  @Action(Actions.WORK_PAYMENT)
  async onWorkPayment(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.WORK_PAYMENT));
    } catch (e) {
      await sendMessage(ctx, e.message);
    }
  }

  @Action(Actions.TASK_COMPONENT_LINK_LIST)
  async taskComponentLinkList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () =>
      ctx.scene.enter(SCENES.TASK_COMPONENT_LINK_LIST),
    );
  }

  @Action(Actions.TASK_COMPONENT_LINK_ADD)
  async taskComponentLinkAdd(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () =>
      ctx.scene.enter(WIZARDS.TASK_COMPONENT_LINK_ADD),
    );
  }
}
