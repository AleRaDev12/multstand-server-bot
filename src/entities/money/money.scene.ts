import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { SCENES, WIZARDS } from '../../shared/scenes-wizards';
import { BaseScene } from '../../shared/base.scene';
import { handleButtonPress } from '../../shared/helpers';
import { Inject } from '@nestjs/common';
import { AccountService } from './account/account.service';

@Scene(SCENES.MONEY)
export class MoneyScene extends BaseScene {
  constructor(
    @Inject(AccountService)
    private readonly accountService: AccountService,
  ) {
    super();
  }

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    const balance = await this.accountService.getAccountBalancesList();

    await ctx.reply(
      `Текущий баланс:\n${balance}`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback('📑 Транзакции', 'transactions_list'),
          Markup.button.callback('➕', 'transaction_add'),
          Markup.button.callback('➕ к заказу', 'transaction_order_add'),
          Markup.button.callback('💸', 'money_transfer'),
        ],
        [
          Markup.button.callback('📑 Счета', 'accounts_list'),
          Markup.button.callback('➕', 'account_add'),
        ],
        [this.menuButton],
      ]),
    );
  }

  @Action('transactions_list')
  async transactionsList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () =>
        ctx.scene.enter(SCENES.TRANSACTION_LIST),
      );
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('transaction_add')
  async addTransaction(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () =>
        ctx.scene.enter(WIZARDS.ADD_TRANSACTION),
      );
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('money_transfer')
  async moneyTransfer(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () =>
        ctx.scene.enter(WIZARDS.ACCOUNT_TRANSFER),
      );
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('transaction_order_add')
  async addTransactionOrder(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () =>
        ctx.scene.enter(WIZARDS.ADD_TRANSACTION_ORDER),
      );
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('accounts_list')
  async standOrdersList(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    try {
      await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.ACCOUNT_LIST));
    } catch (e) {
      await ctx.reply(e.message);
    }
  }

  @Action('account_add')
  async addStandOrder(@Ctx() ctx: Scenes.SceneContext): Promise<void> {
    await handleButtonPress(ctx, () => ctx.scene.enter(WIZARDS.ADD_ACCOUNT));
  }
}
