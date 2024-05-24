import { Action, Ctx, Start, Update } from 'nestjs-telegraf';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Markup, Scenes } from 'telegraf';
import { SCENES } from '../shared/scenes-wizards';
import { handleButtonPress } from '../shared/helpers';

@Update()
export class BotUpdate {
  @Start()
  @UseGuards(RolesGuard)
  async onStart(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await ctx.reply('Start', Markup.keyboard(['/start']).persistent().resize());
    try {
      await ctx.scene.enter(SCENES.MENU);
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('cancel')
  async onButtonClick(@Ctx() ctx: Scenes.SceneContext) {
    await handleButtonPress(ctx, async () => {
      await ctx.scene.leave();
      await ctx.scene.enter(SCENES.MENU);
    });
  }
}
