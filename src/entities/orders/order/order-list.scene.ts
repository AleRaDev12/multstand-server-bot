import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { SCENES } from '../../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { OrderService } from './order.service';
import { handleButtonPress } from '../../../shared/helpers';

@Scene(SCENES.ORDER_LIST)
export class OrderListScene {
  constructor(
    @Inject(OrderService)
    readonly service: OrderService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    const ordersList = await this.service.getFormattedList();
    if (!ordersList) {
      await ctx.reply('Записей нет');
    } else {
      for (const order of ordersList) {
        await ctx.reply(order);
      }
    }
    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.ORDERS));
  }
}
