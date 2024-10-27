import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { SCENES } from '../../../shared/scenes-wizards';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';
import { sendMessage } from '../../../shared/sendMessages';
import { CustomSceneContext } from '../../../shared/types';

@Scene(SCENES.TRANSACTION_LIST)
@SceneRoles('manager')
export class TransactionListScene {
  constructor(
    @Inject(TransactionService)
    private readonly transactionService: TransactionService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: CustomSceneContext): Promise<void> {
    const transactions = await this.transactionService.findAll();
    const formattedList = await this.transactionService.formatList(
      transactions,
      ctx.session.userRole,
    );

    await sendMessage(ctx, 'Транзакции:');

    for (const transaction of formattedList) {
      await sendMessage(ctx, transaction);
    }

    await ctx.scene.leave();
    await ctx.scene.enter(SCENES.MENU);
  }
}
