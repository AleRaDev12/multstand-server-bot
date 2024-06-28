import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { Inject } from '@nestjs/common';
import { SCENES } from '../../../shared/scenes-wizards';
import { StandOrderService } from './stand-order.service';
import { handleButtonPress } from '../../../shared/helpers';

@Scene(SCENES.STAND_ORDER_ACTIVE_LIST)
export class StandOrderActiveListScene {
  constructor(
    @Inject(StandOrderService)
    readonly service: StandOrderService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    const list = await this.service.findInProgress();
    console.log('*-* list', list);

    if (!list || list.length === 0) {
      await ctx.reply('Записей нет');
    } else {
      const formattedList = this.service.formatList(list);
      console.log('*-* formattedList', formattedList);

      for (const standOrder of formattedList) {
        await ctx.reply(standOrder);
      }
    }

    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.ORDERS));
  }
}
