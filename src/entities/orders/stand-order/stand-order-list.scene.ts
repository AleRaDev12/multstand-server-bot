import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { Inject } from '@nestjs/common';
import { SCENES } from '../../../shared/scenes-wizards';
import { StandOrderService } from './stand-order.service';
import { handleButtonPress } from '../../../shared/helpers';

@Scene(SCENES.STAND_ORDER_LIST)
export class StandOrderListScene {
  constructor(
    @Inject(StandOrderService)
    readonly service: StandOrderService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    const list = await this.service.getList();
    await ctx.reply(list ?? 'Записей нет');
    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.ORDER));
  }
}
