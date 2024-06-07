import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup, Scenes } from 'telegraf';
import { Inject } from '@nestjs/common';
import { MoneyService } from './money.service';
import { SCENES } from '../../shared/scenes-wizards';
import { CustomWizardContext } from '../../shared/interfaces';

@Scene(SCENES.TRANSACTION_LIST)
export class TransactionListScene {
  constructor(
    @Inject(MoneyService)
    private readonly moneyService: MoneyService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: CustomWizardContext): Promise<void> {
    const transactions = await this.moneyService.findAll();
    const transactionList = transactions
      .map((transaction, index) => {
        return `${index + 1}. ${transaction.description ? transaction.description : 'Без описания'}\nДата: ${transaction.transactionDate}\nСумма: ${transaction.amount}`;
      })
      .join('\n\n');

    await ctx.reply(
      `Транзакции:\n\n${transactionList}`,
      Markup.inlineKeyboard([
        [Markup.button.callback('Назад в меню', 'back_to_menu')],
      ]),
    );
  }

  @Action('back_to_menu')
  async onBackToMenu(@Ctx() ctx: CustomWizardContext): Promise<void> {
    await ctx.scene.leave();
    await ctx.scene.enter(SCENES.MENU);
  }
}
