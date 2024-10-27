import { handleButtonPress } from '../../../shared/helpers';
import { SCENES } from '../../../shared/scenes-wizards';
import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { StandProdService } from './stand-prod.service';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';
import { Inject } from '@nestjs/common';
import { CustomSceneContext } from '../../../shared/types';
import { sendMessage } from '../../../shared/sendMessages';

@Scene(SCENES.STAND_PROD_LIST)
@SceneRoles('manager')
export class StandProdListScene {
  constructor(
    @Inject(StandProdService)
    readonly service: StandProdService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: CustomSceneContext): Promise<void> {
    const list = await this.service.findAll();
    if (!list || list.length === 0) {
      await sendMessage(ctx, 'Записей нет');
    } else {
      const formattedList = await this.service.formatList(
        list,
        ctx.session.userRole,
      );
      for (const item of formattedList) {
        await sendMessage(ctx, item);
      }
    }
    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.PARTS));
  }
}
