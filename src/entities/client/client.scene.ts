import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { SCENES, SCENES_WIZARDS } from '../../shared/scenes-wizards';

@Scene(SCENES.CLIENT)
export class EnteringScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.reply(
      'Выберите действие:',
      Markup.inlineKeyboard([
        [Markup.button.callback('Список', 'list')],
        [Markup.button.callback('Лобавить', 'add')],
        [Markup.button.callback('Изменить (не работает)', 'update')],
      ]),
    );
  }

  @Action('list')
  async onList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await ctx.scene.enter(SCENES.CLIENT_LIST);
    } catch (e) {
      await ctx.reply(e.message);
    }
  }
  @Action('add')
  async onAdd(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await ctx.scene.enter(SCENES_WIZARDS.CLIENT_ADD);
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('update')
  async onUpdate(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await ctx.scene.enter(SCENES_WIZARDS.CLIENT_UPDATE);
    } catch (e) {
      await ctx.reply(e.message);
    }
  }
}
