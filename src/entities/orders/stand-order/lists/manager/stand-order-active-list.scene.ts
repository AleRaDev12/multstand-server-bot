import { StandOrderService } from '../../stand-order.service';
import { Scene, SceneEnter } from 'nestjs-telegraf';
import { handleButtonPress } from '../../../../../shared/helpers';
import { SCENES } from '../../../../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import {
  CtxWithUserId,
  SceneContextWithUserId,
} from '../../../../../bot/decorators/ctx-with-user-id.decorator';

@Scene(SCENES.STAND_ORDER_ACTIVE_LIST)
export class StandOrderActiveListScene {
  constructor(
    @Inject(StandOrderService)
    readonly service: StandOrderService,
  ) {}

  @SceneEnter()
  async onSceneEnter(
    @CtxWithUserId() ctx: SceneContextWithUserId,
  ): Promise<void> {
    const list = await this.service.findInProgress();

    if (!list || list.length === 0) {
      await ctx.reply('Записей нет');
    } else {
      const formattedList = await this.service.formatList(list, ctx.userId);

      for (const standOrder of formattedList) {
        await ctx.reply(standOrder);
      }
    }

    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.ORDERS));
  }
}
