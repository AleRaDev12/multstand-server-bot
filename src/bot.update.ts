import { Ctx, Hears, On, Start, Update } from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { ADD_ORDER_WIZARD_ID, ADD_USER_WIZARD_ID } from './shared/constants';
import { Context } from './shared/interfaces';

@Update()
export class BotUpdate {
  @Start()
  async onStart(@Ctx() ctx: Context): Promise<void> {
    await ctx.replyWithHTML(
      'Выберите действие:',
      Markup.inlineKeyboard([
        Markup.button.callback('Добавить пользователя', 'add_user'),
        Markup.button.callback('Добавить заказ', 'add_order'),
      ]),
    );
  }

  @On('callback_query')
  @Hears('add_user')
  async onAddUser(@Ctx() ctx: Context): Promise<void> {
    await ctx.scene.enter(ADD_USER_WIZARD_ID);
  }

  @On('callback_query')
  @Hears('add_order')
  async onAddOrder(@Ctx() ctx: Context): Promise<void> {
    await ctx.scene.enter(ADD_ORDER_WIZARD_ID);
  }
}
