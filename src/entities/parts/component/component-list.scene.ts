import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { SCENES } from '../../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { Scenes } from 'telegraf';
import { handleButtonPress } from '../../../shared/helpers';
import { ComponentService } from './component.service';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';
import { formatWithListIndexes } from '../../../../dist/src/shared/helpers';

@Scene(SCENES.COMPONENT_LIST)
@SceneRoles('manager')
export class ComponentListScene {
  constructor(
    @Inject(ComponentService)
    readonly service: ComponentService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    const list = await this.service.getList();
    if (!list || list.length === 0) {
      await ctx.reply('Записей нет');
      return;
    }
    await ctx.reply(formatWithListIndexes(list).join('\n'));

    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.PARTS));
  }
}
