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
    const list = await this.service.getList();
    await ctx.reply(list ?? 'Записей нет');
    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.COMPONENTS));
  }
}
