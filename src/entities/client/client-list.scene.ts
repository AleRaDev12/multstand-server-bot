import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { SCENES } from '../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { ClientService } from './client.service';
import { handleButtonPress } from '../../shared/helpers';

@Scene(SCENES.CLIENT_LIST)
export class ClientListScene {
  constructor(
    @Inject(ClientService)
    readonly service: ClientService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    const clientsList = await this.service.getList();
    await ctx.reply(clientsList ?? 'Записей нет');
    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.CLIENT));
  }
}
