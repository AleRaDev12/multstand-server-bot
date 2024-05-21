import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { SCENES, WIZARDS } from '../../shared/scenes-wizards';

@Scene(SCENES.ORDER)
export class OrderScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.reply(
      'Заказы:',
      Markup.inlineKeyboard([
        [Markup.button.callback('Список', 'list')],
        [Markup.button.callback('Лобавить', 'add')],
      ]),
    );
  }

  @Action('list')
  async onList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await ctx.scene.enter(SCENES.ORDER_LIST);
    } catch (e) {
      await ctx.reply(e.message);
    }
  }
  @Action('add')
  async onAdd(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await ctx.scene.enter(WIZARDS.ORDER_ADD);
    } catch (e) {
      await ctx.reply(e.message);
    }
  }
}
