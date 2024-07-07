import { Scene, SceneEnter } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { SCENES } from '../../../../shared/scenes-wizards';
import { StandOrderService } from '../stand-order.service';
import { handleButtonPress } from '../../../../shared/helpers';
import { SceneRoles } from '../../../../bot/decorators/scene-roles.decorator';
import { CtxAuth } from '../../../../bot/decorators/ctx-auth.decorator';
import { SceneAuthContext } from '../../../../shared/interfaces';

@Scene(SCENES.STAND_ORDER_LIST)
@SceneRoles('manager')
export class StandOrderListScene {
  constructor(
    @Inject(StandOrderService)
    readonly service: StandOrderService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@CtxAuth() ctx: SceneAuthContext): Promise<void> {
    const list = await this.service.findAll();
    if (!list) {
      await ctx.reply('Записей нет');
    }

    const formattedList = await this.service.formatList(list, ctx.userRole);

    for (const standOrder of formattedList) {
      await ctx.reply(standOrder);
    }

    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.ORDERS));
  }
}
