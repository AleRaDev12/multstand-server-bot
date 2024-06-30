import { SCENES } from '../../shared/scenes-wizards';
import { handleButtonPress } from '../../shared/helpers';
import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneRoles } from '../../bot/decorators/scene-roles.decorator';
import { Inject } from '@nestjs/common';
import { Scenes } from 'telegraf';
import { ComponentsService } from './components.service';

@Scene(SCENES.COMPONENT_REMAINING_LIST)
@SceneRoles('manager')
export class ComponentsRemainingListScene {
  constructor(
    @Inject(ComponentsService)
    readonly componentsService: ComponentsService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    const list = await this.componentsService.getRemainingList();

    if (!list) {
      await ctx.reply('Записей нет');
    } else {
      await ctx.reply(list.join('\n'));
    }

    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.COMPONENTS));
  }
}
