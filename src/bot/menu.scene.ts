import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { SCENES, WIZARDS } from '../shared/scenes-wizards';
import { handleButtonPress } from '../shared/helpers';

@Scene(SCENES.MENU)
export class MenuScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.reply(
      'Выберите действие:',
      Markup.inlineKeyboard([
        [Markup.button.callback('Клиенты', 'client')],
        [Markup.button.callback('Заказы', 'order')],
        [Markup.button.callback('Станок-изделие', 'add_stand')],
        [
          Markup.button.callback('Комплектующие', 'add_component'),
          Markup.button.callback('заказ/приход', 'add_partsIn'),
          Markup.button.callback('расход', 'add_partsOut'),
        ],
        [
          Markup.button.callback('Работа', 'add_work'),
          Markup.button.callback('Задача', 'add_task'),
        ],
        [Markup.button.callback('Деньги', 'money')],
      ]),
    );
  }

  @Action('client')
  async onClient(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.CLIENT));
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('order')
  async onOrder(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.ORDER));
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('add_stand')
  async onAddStandProd(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_STAND_PROD));
  }

  @Action('add_partsIn')
  async onAddPartIn(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_PART_IN));
  }

  @Action('add_partsOut')
  async onAddPartOut(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_PART_OUT));
  }

  @Action('add_work')
  async onAddWork(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_WORK));
  }

  @Action('add_task')
  async onAddTask(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_TASK));
  }

  @Action('add_component')
  async onAddComponent(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_COMPONENT));
  }

  @Action('money')
  async onAddMoney(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.MONEY));
  }
}
