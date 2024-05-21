import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { SCENES } from '../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { OrderService } from './order.service';
import { handleButtonPress } from '../../shared/helpers';

@Scene(SCENES.ORDER_LIST)
export class OrderListScene {
  constructor(
    @Inject(OrderService)
    readonly service: OrderService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.reply(await this.service.getList());
    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.ORDER));
  }
}
