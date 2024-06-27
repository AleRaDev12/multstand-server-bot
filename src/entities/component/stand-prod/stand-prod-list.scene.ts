import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { SCENES } from '../../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { Scenes } from 'telegraf';
import { handleButtonPress } from '../../../shared/helpers';
import { StandProdService } from './stand-prod.service';

@Scene(SCENES.STAND_PROD_LIST)
export class StandProdListScene {
  constructor(
    @Inject(StandProdService)
    readonly service: StandProdService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    const list = await this.service.getFormattedList();

    if (!list) {
      await ctx.reply('Записей нет');
    } else {
      for (const item of list) {
        await ctx.reply(item);
      }
    }
    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.COMPONENTS));
  }
}
