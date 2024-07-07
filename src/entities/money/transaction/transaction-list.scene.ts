import { Scene, SceneEnter } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { SCENES } from '../../../shared/scenes-wizards';
import { SceneAuthContext } from '../../../shared/interfaces';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';
import { CtxAuth } from '../../../bot/decorators/ctx-auth.decorator';

@Scene(SCENES.TRANSACTION_LIST)
@SceneRoles('manager')
export class TransactionListScene {
  constructor(
    @Inject(TransactionService)
    private readonly transactionService: TransactionService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@CtxAuth() ctx: SceneAuthContext): Promise<void> {
    const transactions = await this.transactionService.findAll();
    const formattedList = await this.transactionService.formatList(
      transactions,
      ctx.userRole,
    );

    await ctx.reply('Транзакции:');

    for (const transaction of formattedList) {
      await ctx.reply(transaction);
    }

    await ctx.scene.leave();
    await ctx.scene.enter(SCENES.MENU);
  }
}
