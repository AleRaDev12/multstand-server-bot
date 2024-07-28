import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { SCENES, WIZARDS } from '../../shared/scenes-wizards';
import { BaseScene } from '../../shared/base.scene';
import { Markup, Scenes } from 'telegraf';
import { handleButtonPress } from '../../shared/helpers';
import { SceneRoles } from '../../bot/decorators/scene-roles.decorator';
import { sendMessage } from '../../shared/senMessages';

enum Actions {
  COMPONENT_LIST = 'component_list',
  COMPONENT_ADD = 'component_add',
  PARTS_REMAINING_LIST = 'parts_remaining_list',
  PART_IN_LIST = 'part_in_list',
  PART_IN_ADD = 'part_in_add',
  PART_OUT_LIST = 'part_out_list',
  PART_OUT_ADD = 'part_out_add',
  STAND_PROD_LIST = 'stand_prod_list',
  STAND_PROD_ADD = 'stand_prod_add',
}

@Scene(SCENES.PARTS)
@SceneRoles('manager')
export class PartsScene extends BaseScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await sendMessage(
      ctx,
      'Компоненты:',
      Markup.inlineKeyboard([
        [
          Markup.button.callback('📑 Комплектующие', Actions.COMPONENT_LIST),
          Markup.button.callback('➕', Actions.COMPONENT_ADD),
          Markup.button.callback('Остатки', Actions.PARTS_REMAINING_LIST),
        ],
        [
          Markup.button.callback('📑 Поступление', Actions.PART_IN_LIST),
          Markup.button.callback('➕', Actions.PART_IN_ADD),
        ],
        [
          Markup.button.callback(
            '📑 Расход (на станки)',
            Actions.PART_OUT_LIST,
          ),
          Markup.button.callback('➕', Actions.PART_OUT_ADD),
        ],
        [
          Markup.button.callback('📑 Станки-прод', Actions.STAND_PROD_LIST),
          Markup.button.callback('➕', Actions.STAND_PROD_ADD),
        ],
        [this.menuButton],
      ]),
    );
  }

  @Action(Actions.COMPONENT_LIST)
  async componentList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () =>
        ctx.scene.enter(SCENES.COMPONENT_LIST),
      );
    } catch (e) {
      await sendMessage(ctx, e.message);
    }
  }

  @Action(Actions.COMPONENT_ADD)
  async componentAdd(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () =>
        ctx.scene.enter(WIZARDS.ADD_COMPONENT),
      );
    } catch (e) {
      await sendMessage(ctx, e.message);
    }
  }

  @Action(Actions.PARTS_REMAINING_LIST)
  async componentRemainingList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () =>
        ctx.scene.enter(SCENES.PARTS_REMAINING_LIST),
      );
    } catch (e) {
      await sendMessage(ctx, e.message);
    }
  }

  @Action(Actions.PART_IN_LIST)
  async partInList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.PART_IN_LIST));
    } catch (e) {
      await sendMessage(ctx, e.message);
    }
  }

  @Action(Actions.PART_IN_ADD)
  async partInAdd(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_PART_IN));
  }

  @Action(Actions.PART_OUT_LIST)
  async partOutList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.PART_OUT_LIST));
    } catch (e) {
      await sendMessage(ctx, e.message);
    }
  }

  @Action(Actions.PART_OUT_ADD)
  async partOutAdd(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_PART_OUT));
  }

  @Action(Actions.STAND_PROD_LIST)
  async standProdList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () =>
        ctx.scene.enter(SCENES.STAND_PROD_LIST),
      );
    } catch (e) {
      await sendMessage(ctx, e.message);
    }
  }

  @Action(Actions.STAND_PROD_ADD)
  async standProdAdd(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_STAND_PROD));
  }
}
