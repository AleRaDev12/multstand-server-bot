import { SCENES } from '../../shared/scenes-wizards';
import { handleButtonPress } from '../../shared/helpers';
import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneRoles } from '../../bot/decorators/scene-roles.decorator';
import { Inject } from '@nestjs/common';
import { Scenes } from 'telegraf';
import { PartsService } from './parts.service';
import { sendMessage, sendMessages } from '../../shared/sendMessages';

@Scene(SCENES.PARTS_REMAINING_LIST)
@SceneRoles('manager')
export class PartsRemainingListScene {
  constructor(
    @Inject(PartsService)
    readonly componentsService: PartsService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    const list = await this.componentsService.getRemainingList();
    const formattedList = this.componentsService.formatRemainingList(list);

    if (!formattedList) {
      await sendMessage(ctx, 'Записей нет');
    }

    await sendMessages(ctx, formattedList, 'full');

    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.PARTS));
  }
}
