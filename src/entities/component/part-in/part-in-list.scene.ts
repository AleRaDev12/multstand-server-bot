import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { SCENES } from '../../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { Scenes } from 'telegraf';
import { handleButtonPress } from '../../../shared/helpers';
import { PartInService } from './part-in.service';

@Scene(SCENES.PART_IN_LIST)
export class PartInListScene {
  constructor(
    @Inject(PartInService)
    readonly service: PartInService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    const list = await this.service.getList();
    await ctx.reply(list ?? 'Записей нет');
    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.COMPONENTS));
  }
}
