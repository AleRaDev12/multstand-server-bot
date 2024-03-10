import { Action, Ctx, Start, Update } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { WIZARDS } from './shared/wizards';

@Update()
export class BotUpdate {
  @Start()
  async onStart(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.replyWithHTML(
      'Выберите действие:',
      Markup.inlineKeyboard([
        Markup.button.callback('Добавить пользователя', 'add_user'),
        Markup.button.callback('Добавить заказ', 'add_order'),
      ]),
    );
  }

  @Action('add_user')
  async onAddUser(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await ctx.scene.enter(WIZARDS.ADD_USER_WIZARD_ID);
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('add_order')
  async onAddOrder(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.scene.enter(WIZARDS.ADD_ORDER_WIZARD_ID);
  }
}
