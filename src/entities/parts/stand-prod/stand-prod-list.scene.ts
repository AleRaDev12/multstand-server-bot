import { handleButtonPress } from '../../../shared/helpers';
import { SCENES } from '../../../shared/scenes-wizards';
import {
  CtxWithUserId,
  SceneContextWithUserId,
} from '../../../bot/decorators/ctx-with-user-id.decorator';
import { Scene, SceneEnter } from 'nestjs-telegraf';
import { StandProdService } from './stand-prod.service';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';
import { Inject } from '@nestjs/common';

@Scene(SCENES.STAND_PROD_LIST)
@SceneRoles('manager')
export class StandProdListScene {
  constructor(
    @Inject(StandProdService)
    readonly service: StandProdService,
  ) {}

  @SceneEnter()
  async onSceneEnter(
    @CtxWithUserId() ctx: SceneContextWithUserId,
  ): Promise<void> {
    const list = await this.service.findAll();
    console.log('*-* list', list);
    if (!list || list.length === 0) {
      await ctx.reply('Записей нет');
    } else {
      const formattedList = await this.service.formatList(
        list,
        ctx.telegramUserId,
      );
      for (const item of formattedList) {
        await ctx.reply(item);
      }
    }
    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.PARTS));
  }
}
