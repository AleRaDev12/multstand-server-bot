import { Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';
import { Inject } from '@nestjs/common';
import { StandProdService } from './stand-prod.service';
import { handleButtonPress } from '../../../shared/helpers';
import { SCENES } from '../../../shared/scenes-wizards';
import { CtxAuth } from '../../../bot/decorators/ctx-auth.decorator';
import { SceneAuthContext } from '../../../shared/interfaces';
import { sendMessage } from '../../../shared/senMessages';

@Scene(SCENES.STAND_PROD_NOT_LINKED_LIST)
@SceneRoles('manager', 'master')
export class StandProdNotLinkedListScene {
  constructor(
    @Inject(StandProdService)
    readonly service: StandProdService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@CtxAuth() ctx: SceneAuthContext): Promise<void> {
    const list = await this.service.findNotLinked();

    if (!list || list.length === 0) {
      await sendMessage(ctx, 'Записей нет');
    } else {
      const formattedList = await this.service.formatList(
        list,
        ctx.state.userRole,
      );

      for (const standProd of formattedList) {
        await sendMessage(ctx, standProd);
      }
    }

    await ctx.scene.leave();
    const userRole = ctx.userRole;

    switch (userRole) {
      case 'manager':
        await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.PARTS));
        break;
      default:
        await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.MENU));
        break;
    }
  }
}
