import { Action, Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Markup, Scenes, Telegraf } from 'telegraf';
import { SCENES } from '../shared/scenes-wizards';
import { handleButtonPress } from '../shared/helpers';
import { CustomContext } from '../shared/interfaces';

@Update()
export class BotUpdate {
  constructor(@InjectBot() private bot: Telegraf) {
    this.setupCommands();
  }

  setupCommands() {
    void this.bot.telegram.setMyCommands([
      { command: '/start', description: 'Запуск' },
    ]);
  }

  @Start()
  @UseGuards(RolesGuard)
  async onStart(@Ctx() ctx: CustomContext): Promise<void> {
    if (ctx.notRegistered) {
      await ctx.reply('Нт доступа');
      return;
    }

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
