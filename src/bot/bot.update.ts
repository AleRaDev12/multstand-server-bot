import { Action, Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Scenes, Telegraf } from 'telegraf';
import { SCENES } from '../shared/scenes-wizards';
import { handleButtonPress } from '../shared/helpers';
import { CustomContext, CustomWizardContext } from '../shared/interfaces';
import { format, subDays } from 'date-fns';
import { UserService } from '../entities/user/user.service';
import { Inject, OnApplicationBootstrap } from '@nestjs/common';
import { SceneContext } from 'telegraf/typings/scenes';
import { sendMessage } from '../shared/senMessages';

export enum BotActions {
  CANCEL = 'cancel',
  DATE_TODAY = 'date-today',
  DATE_YESTERDAY = 'date-yesterday',
  DATE_BEFORE_YESTERDAY = 'date-before-yesterday',
}

@Update()
export class BotUpdate implements OnApplicationBootstrap {
  constructor(
    @InjectBot() private bot: Telegraf<SceneContext>,
    @Inject(UserService) private userService: UserService,
  ) {
    this.setupCommands();
  }

  setupCommands() {
    void this.bot.telegram.setMyCommands([
      { command: '/start', description: 'Запуск' },
    ]);
  }

  async onApplicationBootstrap() {
    await this.notifyAllUsers();
  }

  async notifyAllUsers() {
    const users = await this.userService.findAll();
    for (const user of users) {
      if (user.role !== 'unregistered' && user.role !== 'unknown')
        try {
          await this.bot.telegram.sendMessage(
            user.telegramUserId,
            'Бот перезапущен.\nКнопки из сообщений выше больше не активны.\nНажмите /start для продолжения работы.',
          );
        } catch (error) {
          console.error(`Failed to notify user ${user.telegramUserId}:`, error);
        }
    }
  }

  @Start()
  async onStart(@Ctx() ctx: CustomContext): Promise<void> {
    if (ctx.notRegistered) {
      await sendMessage(ctx, 'Нет доступа');
      return;
    }

    try {
      await ctx.scene.enter(SCENES.MENU);
    } catch (e) {
      await sendMessage(ctx, e.message);
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

      await sendMessage(
        ctx,
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

      await sendMessage(
        ctx,
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

      await sendMessage(
        ctx,
        `Выбрано: ${format(date, 'yyyy-MM-dd')}. Для продолжения введите любой текст, кроме "-"`,
      );
      await ctx.answerCbQuery();
    });
  }
}
