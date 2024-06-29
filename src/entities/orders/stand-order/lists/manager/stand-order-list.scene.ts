import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { Inject } from '@nestjs/common';
import { SCENES } from '../../../../../shared/scenes-wizards';
import { StandOrderService } from '../../stand-order.service';
import { handleButtonPress } from '../../../../../shared/helpers';

@Scene(SCENES.STAND_ORDER_LIST)
export class StandOrderListScene {
  constructor(
    @Inject(StandOrderService)
    readonly service: StandOrderService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    const list = await this.service.findAll();
    if (!list) {
      await ctx.reply('Записей нет');
    }

    const userId = ctx.from.id;
    const formattedList = await this.service.formatList(list, userId);

    for (const standOrder of formattedList) {
      await ctx.reply(standOrder);
    }

    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.ORDERS));
  }
}
