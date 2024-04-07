import { Action, Ctx, Start, Update } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { WIZARDS } from './shared/wizards';

@Update()
export class BotUpdate {
  @Start()
  async onStart(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.reply('-', Markup.keyboard(['/start']).oneTime().resize());

    await ctx.replyWithHTML(
      'Выберите действие:',
      Markup.inlineKeyboard([
        [
          Markup.button.callback('Клиент', 'add_user'),
          Markup.button.callback('Заказ', 'add_order'),
        ],
        [
          Markup.button.callback('Станок', 'add_stand'),
          Markup.button.callback('Комплектующее', 'add_partsIn'),
        ],
        [
          Markup.button.callback('Работа', 'add_work'),
          Markup.button.callback('Задача', 'add_task'),
        ],
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

  @Action('add_stand')
  async onAddStand(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.scene.enter(WIZARDS.ADD_STAND_WIZARD_ID);
  }
  @Action('add_partsIn')
  async onAddPartIn(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.scene.enter(WIZARDS.ADD_PART_IN_WIZARD_ID);
  }
  @Action('add_work')
  async onAddWork(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.scene.enter(WIZARDS.ADD_WORK_IN_WIZARD_ID);
  }
  @Action('add_task')
  async onAddTask(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.scene.enter(WIZARDS.ADD_TASK_WIZARD_ID);
  }
}
