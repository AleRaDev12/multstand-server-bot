import { SCENES } from '../shared/scenes-wizards';
import { Action, Ctx, Start, Update } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';

@Update()
export class BotUpdate {
  @Start()
  async onStart(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.reply('Start', Markup.keyboard(['/start']).persistent().resize());
    await ctx.scene.enter(SCENES.ENTERING);
  }

  @Action('cancel')
  async onButtonClick(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.scene.leave();
    await ctx.scene.enter(SCENES.ENTERING);
  }
}
