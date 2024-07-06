import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { Inject } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { SCENES } from '../../../shared/scenes-wizards';
import { CustomWizardContext } from '../../../shared/interfaces';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';

@Scene(SCENES.TRANSACTION_LIST)
@SceneRoles('manager')
export class TransactionListScene {
  constructor(
    @Inject(TransactionService)
    private readonly transactionService: TransactionService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: CustomWizardContext): Promise<void> {
    const transactions = await this.transactionService.findAll();
    const transactionList = transactions.map((transaction, index) => {
      return `№${index + 1}.\n${transaction.description ? transaction.description : 'Без описания'}\nДата: ${transaction.transactionDate}\nСумма: ${transaction.amount}`;
    });

    await ctx.reply('Транзакции:');

    for (const transaction of transactionList) {
      await ctx.reply(transaction);
    }

    await ctx.scene.leave();
    await ctx.scene.enter(SCENES.MENU);
  }
}
