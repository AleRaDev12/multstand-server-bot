import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { SCENES } from '../../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { Scenes } from 'telegraf';
import { handleButtonPress } from '../../../shared/helpers';
import { PartInService } from './part-in.service';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';

@Scene(SCENES.PART_IN_LIST)
@SceneRoles('manager')
export class PartInListScene {
  constructor(
    @Inject(PartInService)
    readonly service: PartInService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    const partsInList = await this.service.getFormattedList();

    if (!partsInList) {
      await ctx.reply('Записей нет');
    } else {
      for (const partIn of partsInList) {
        await ctx.reply(partIn);
      }
    }

    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.PARTS));
  }
}
