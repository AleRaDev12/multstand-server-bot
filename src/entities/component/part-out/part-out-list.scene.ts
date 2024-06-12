import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { SCENES } from '../../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { Scenes } from 'telegraf';
import { handleButtonPress } from '../../../shared/helpers';
import { PartOutService } from './part-out.service';

@Scene(SCENES.PART_OUT_LIST)
export class PartOutListScene {
  constructor(
    @Inject(PartOutService)
    readonly service: PartOutService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    const list = await this.service.getList();
    await ctx.reply(list ?? 'Записей нет');
    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.COMPONENTS));
  }
}
