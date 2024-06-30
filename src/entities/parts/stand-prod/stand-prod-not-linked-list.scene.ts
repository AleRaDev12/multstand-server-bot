import { Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';
import { Inject } from '@nestjs/common';
import { StandProdService } from './stand-prod.service';
import { UserService } from '../../user/user.service';
import {
  CtxWithUserId,
  SceneContextWithUserId,
} from '../../../bot/decorators/ctx-with-user-id.decorator';
import { handleButtonPress } from '../../../shared/helpers';
import { SCENES } from '../../../shared/scenes-wizards';

@Scene(SCENES.STAND_PROD_NOT_LINKED_LIST)
@SceneRoles('manager', 'master')
export class StandProdNotLinkedListScene {
  constructor(
    @Inject(StandProdService)
    readonly service: StandProdService,
    @Inject(UserService)
    readonly userService: UserService,
  ) {}

  @SceneEnter()
  async onSceneEnter(
    @CtxWithUserId() ctx: SceneContextWithUserId,
  ): Promise<void> {
    const list = await this.service.findNotLinked();

    if (!list || list.length === 0) {
      await ctx.reply('Записей нет');
    } else {
      const formattedList = await this.service.formatList(list, ctx.userId);

      for (const standProd of formattedList) {
        await ctx.reply(standProd);
      }
    }

    await ctx.scene.leave();
    const userRole = await this.userService.getRoleByUserId(ctx.userId);

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
