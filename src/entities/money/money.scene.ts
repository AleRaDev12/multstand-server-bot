import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { Inject } from '@nestjs/common';
import { MoneyService } from './money.service';
import { SCENES, WIZARDS } from '../../shared/scenes-wizards';
import { handleButtonPress } from '../../shared/helpers';

@Scene(SCENES.MONEY)
export class MoneyScene {
  constructor(
    @Inject(MoneyService)
    private readonly moneyService: MoneyService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    const balance = await this.moneyService.getBalance();
    await ctx.reply(
      `Текущий баланс: ${balance}`,
      Markup.inlineKeyboard([
        [Markup.button.callback('Посмотреть транзакции', 'view_transactions')],
        [Markup.button.callback('Добавить приход/расход', 'add_transaction')],
        [Markup.button.callback('Приход по заказу', 'add_order')],
      ]),
    );
  }

  @Action('view_transactions')
  async onViewTransactions(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () =>
        ctx.scene.enter(SCENES.TRANSACTION_LIST),
      );
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('add_transaction')
  async onAddTransaction(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_MONEY));
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('add_order')
  async onAddOrder(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () =>
        ctx.scene.enter(WIZARDS.ADD_MONEY_ORDER),
      );
    } catch (e) {
      await ctx.reply(e.message);
    }
  }
}
