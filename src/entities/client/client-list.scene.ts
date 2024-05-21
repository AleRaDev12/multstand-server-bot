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
    await ctx.reply(await this.service.getList());
    await ctx.scene.leave();
    await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.CLIENT));
  }
}
