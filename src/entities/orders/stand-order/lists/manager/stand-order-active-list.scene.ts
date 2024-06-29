import { StandOrderService } from '../../stand-order.service';
import { Scene, SceneEnter } from 'nestjs-telegraf';
import { assertNever, handleButtonPress } from '../../../../../shared/helpers';
import { SCENES } from '../../../../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import {
  CtxWithUserId,
  SceneContextWithUserId,
} from '../../../../../bot/decorators/ctx-with-user-id.decorator';
import { SceneRoles } from '../../../../../bot/decorators/scene-roles.decorator';
import { UserService } from '../../../../user/user.service';

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
    const userRole = await this.userService.getRoleByUserId(ctx.userId);
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
