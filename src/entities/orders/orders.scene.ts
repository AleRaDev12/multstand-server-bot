import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { SCENES, WIZARDS } from '../../shared/scenes-wizards';
import { BaseScene } from '../../shared/base.scene';
import { handleButtonPress } from '../../shared/helpers';
import { SceneRoles } from '../../bot/decorators/scene-roles.decorator';
import { sendMessage } from '../../shared/sendMessages';

@Scene(SCENES.ORDERS)
@SceneRoles('manager')
export class OrdersScene extends BaseScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await sendMessage(
      ctx,
      'Заказы:',
      Markup.inlineKeyboard([
        [
          Markup.button.callback('➕ Заказ-клиент', 'add_order'),
          Markup.button.callback('📑', 'order_list'),
        ],
        [
          Markup.button.callback('➕ Заказ-станок', 'add_stand_order'),
          Markup.button.callback('📑', 'stand_orders_list'),
          Markup.button.callback('В работе', 'stand_orders_active_list'),
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
      await sendMessage(ctx, e.message);
    }
  }

  @Action('add_order')
  async addOrder(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ORDER_ADD));
    } catch (e) {
      await sendMessage(ctx, e.message);
    }
  }

  @Action('stand_orders_list')
  async standOrdersList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () =>
        ctx.scene.enter(SCENES.STAND_ORDER_LIST),
      );
    } catch (e) {
      await sendMessage(ctx, e.message);
    }
  }

  @Action('stand_orders_active_list')
  async standOrdersActiveList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () =>
        ctx.scene.enter(SCENES.STAND_ORDER_ACTIVE_LIST),
      );
    } catch (e) {
      await sendMessage(ctx, e.message);
    }
  }

  @Action('add_stand_order')
  async addStandOrder(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () =>
      ctx.scene.enter(WIZARDS.ADD_STAND_ORDER),
    );
  }
}
