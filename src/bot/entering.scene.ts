import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { SCENES, WIZARDS } from '../shared/wizards';

@Scene(SCENES.ENTERING)
export class EnteringScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.reply(
      'Выберите действие:',
      Markup.inlineKeyboard([
        [
          Markup.button.callback('Клиент', 'add_user'),
          Markup.button.callback('Заказ', 'add_order'),
        ],
        [
          Markup.button.callback('Станок-заказ', 'add_stand_set'),
          Markup.button.callback('Станок-изделие', 'add_stand'),
        ],
        [
          Markup.button.callback('Комплектующие', 'add_component'),
          Markup.button.callback('заказ/приход', 'add_partsIn'),
          Markup.button.callback('расход', 'add_partsOut'),
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
      await ctx.scene.enter(WIZARDS.ADD_USER);
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('add_order')
  async onAddOrder(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.scene.enter(WIZARDS.ADD_ORDER);
  }

  @Action('add_stand')
  async onAddStandProd(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.scene.enter(WIZARDS.ADD_STAND_PROD);
  }

  @Action('add_partsIn')
  async onAddPartIn(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.scene.enter(WIZARDS.ADD_PART_IN);
  }

  @Action('add_partsOut')
  async onAddPartOut(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.scene.enter(WIZARDS.ADD_PART_OUT);
  }

  @Action('add_work')
  async onAddWork(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.scene.enter(WIZARDS.ADD_WORK);
  }

  @Action('add_task')
  async onAddTask(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.scene.enter(WIZARDS.ADD_TASK);
  }

  @Action('add_stand_set')
  async onAddStandOrder(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.scene.enter(WIZARDS.ADD_STAND_ORDER);
  }

  @Action('add_component')
  async onAddComponent(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.scene.enter(WIZARDS.ADD_COMPONENT);
  }
}
