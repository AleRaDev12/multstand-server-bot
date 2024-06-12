import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { SCENES, WIZARDS } from '../../shared/scenes-wizards';
import { BaseScene } from '../../shared/base.scene';
import { handleButtonPress } from '../../shared/helpers';

@Scene(SCENES.ORDERS)
export class OrdersScene extends BaseScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.reply(
      'Заказы:',
      Markup.inlineKeyboard([
        [
          Markup.button.callback('📑 Заказы', 'order_list'),
          Markup.button.callback('➕', 'add_order'),
        ],
        [
          Markup.button.callback('📑 Станки-заказы', 'stand_orders_list'),
          Markup.button.callback('➕', 'add_stand_order'),
        ],
        [this.menuButton],
      ]),
    );
  }

  @Action('order_list')
  async ordersList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.ORDER_LIST));
    } catch (e) {
      await ctx.reply(e.message);
    }
  }
  @Action('add_order')
  async addOrder(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ORDER_ADD));
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('stand_orders_list')
  async standOrdersList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () =>
        ctx.scene.enter(SCENES.STAND_ORDER_LIST),
      );
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('add_stand_order')
  async addStandOrder(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () =>
      ctx.scene.enter(WIZARDS.ADD_STAND_ORDER),
    );
  }
}
