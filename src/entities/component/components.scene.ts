import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { SCENES, WIZARDS } from '../../shared/scenes-wizards';
import { BaseScene } from '../../shared/base.scene';
import { Markup, Scenes } from 'telegraf';
import { handleButtonPress } from '../../shared/helpers';
import { SceneRoles } from '../../bot/decorators/scene-roles.decorator';

@Scene(SCENES.COMPONENTS)
@SceneRoles('manager')
export class ComponentsScene extends BaseScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.reply(
      'Компоненты:',
      Markup.inlineKeyboard([
        [
          Markup.button.callback('📑 Комплектующие', 'component_list'),
          Markup.button.callback('➕', 'component_add'),
        ],
        [
          Markup.button.callback('📑 Поступление', 'part_in_list'),
          Markup.button.callback('➕', 'part_in_add'),
        ],
        [
          Markup.button.callback('📑 Расход (на станки)', 'part_out_list'),
          Markup.button.callback('➕', 'part_out_add'),
        ],
        [
          Markup.button.callback('📑 Станки-прод', 'stand_prod_list'),
          Markup.button.callback('➕', 'stand_prod_add'),
        ],
        [this.menuButton],
      ]),
    );
  }

  @Action('component_list')
  async componentList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () =>
        ctx.scene.enter(SCENES.COMPONENT_LIST),
      );
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('component_add')
  async componentAdd(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () =>
        ctx.scene.enter(WIZARDS.ADD_COMPONENT),
      );
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('part_in_list')
  async partInList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.PART_IN_LIST));
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('part_in_add')
  async partInAdd(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_PART_IN));
  }

  @Action('part_out_list')
  async partOutList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.PART_OUT_LIST));
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('part_out_add')
  async partOutAdd(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_PART_OUT));
  }

  @Action('stand_prod_list')
  async standProdList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () =>
        ctx.scene.enter(SCENES.STAND_PROD_LIST),
      );
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('stand_prod_add')
  async standProdAdd(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_STAND_PROD));
  }
}
