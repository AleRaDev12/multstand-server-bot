import { Action, Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { UseGuards } from '@nestjs/common';
import { RegistrationGuard } from './guards/registration-guard.service';
import { Scenes, Telegraf } from 'telegraf';
import { SCENES } from '../shared/scenes-wizards';
import { handleButtonPress } from '../shared/helpers';
import { CustomContext, CustomWizardContext } from '../shared/interfaces';
import { format, subDays } from 'date-fns';

export enum BotActions {
  CANCEL = 'cancel',
  DATE_TODAY = 'date-today',
  DATE_YESTERDAY = 'date-yesterday',
  DATE_BEFORE_YESTERDAY = 'date-before-yesterday',
}

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
  @UseGuards(RegistrationGuard)
  async onStart(@Ctx() ctx: CustomContext): Promise<void> {
    if (ctx.notRegistered) {
      await ctx.reply('Нет доступа');
      return;
    }

    try {
      await ctx.scene.enter(SCENES.MENU);
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action(BotActions.CANCEL)
  async onButtonClick(@Ctx() ctx: Scenes.SceneContext) {
    await handleButtonPress(ctx, async () => {
      await ctx.scene.leave();
      await ctx.scene.enter(SCENES.MENU);
    });
  }

  @Action(BotActions.DATE_TODAY)
  async onDateToday(@Ctx() ctx: CustomWizardContext) {
    await handleButtonPress(ctx, async () => {
      const date = new Date();
      ctx.wizard.state.selectedDate = date;

      await ctx.reply(
        `Выбрано: ${format(date, 'yyyy-MM-dd')}. Для продолжения введите любой текст, кроме "-"`,
      );
      await ctx.answerCbQuery();
    });
  }

  @Action(BotActions.DATE_YESTERDAY)
  async onDateYesterday(@Ctx() ctx: CustomWizardContext) {
    await handleButtonPress(ctx, async () => {
      const date = subDays(new Date(), 1);
      ctx.wizard.state.selectedDate = date;

      await ctx.reply(
        `Выбрано: ${format(date, 'yyyy-MM-dd')}. Для продолжения введите любой текст, кроме "-"`,
      );
      await ctx.answerCbQuery();
    });
  }

  @Action(BotActions.DATE_BEFORE_YESTERDAY)
  async onDateBeforeYesterday(@Ctx() ctx: CustomWizardContext) {
    await handleButtonPress(ctx, async () => {
      const date = subDays(new Date(), 2);
      ctx.wizard.state.selectedDate = date;

      await ctx.reply(
        `Выбрано: ${format(date, 'yyyy-MM-dd')}. Для продолжения введите любой текст, кроме "-"`,
      );
      await ctx.answerCbQuery();
    });
  }
}
