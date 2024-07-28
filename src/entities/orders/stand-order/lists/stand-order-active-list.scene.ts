import { StandOrderService } from '../stand-order.service';
import { Scene, SceneEnter } from 'nestjs-telegraf';
import { handleButtonPress } from '../../../../shared/helpers';
import { SCENES } from '../../../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { SceneRoles } from '../../../../bot/decorators/scene-roles.decorator';
import { UserService } from '../../../user/user.service';
import { CtxAuth } from '../../../../bot/decorators/ctx-auth.decorator';
import { SceneAuthContext } from '../../../../shared/interfaces';
import { sendMessage } from '../../../../shared/senMessages';

@Scene(SCENES.STAND_ORDER_ACTIVE_LIST)
@SceneRoles('manager', 'master')
export class StandOrderActiveListScene {
  constructor(
    @Inject(StandOrderService)
    readonly service: StandOrderService,
    @Inject(UserService)
    readonly userService: UserService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@CtxAuth() ctx: SceneAuthContext): Promise<void> {
    const list = await this.service.findInProgress();

    if (!list || list.length === 0) {
      await sendMessage(ctx, 'Записей нет');
    } else {
      const formattedList = await this.service.formatList(list, ctx.userRole);

      for (const standOrder of formattedList) {
        await sendMessage(ctx, standOrder);
      }
    }

    await ctx.scene.leave();
    const userRole = ctx.userRole;
    switch (userRole) {
      case 'manager':
        await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.ORDERS));
        break;
      default:
        await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.MENU));
        break;
    }
  }
}
