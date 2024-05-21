import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { SCENES, WIZARDS } from '../../shared/scenes-wizards';
import { BaseScene } from '../../shared/base.scene';
import { handleButtonPress } from '../../shared/helpers';

@Scene(SCENES.CLIENT)
export class ClientScene extends BaseScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.reply(
      'Клиенты:',
      Markup.inlineKeyboard([
        [Markup.button.callback('Список', 'list')],
        [Markup.button.callback('Лобавить', 'add')],
        [Markup.button.callback('Изменить (не работает)', 'update')],
        [this.menuButton],
      ]),
    );
  }

  @Action('list')
  async onList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.CLIENT_LIST));
    } catch (e) {
      await ctx.reply(e.message);
    }
  }
  @Action('add')
  async onAdd(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.CLIENT_ADD));
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('update')
  async onUpdate(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () =>
        ctx.scene.enter(WIZARDS.CLIENT_UPDATE),
      );
    } catch (e) {
      await ctx.reply(e.message);
    }
  }
}
