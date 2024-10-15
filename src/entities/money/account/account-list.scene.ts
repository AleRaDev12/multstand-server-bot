import { AccountService } from './account.service';
import { CustomWizardContext } from '../../../shared/interfaces';
import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { SCENES } from '../../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { Markup } from 'telegraf';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';
import { sendMessage } from '../../../shared/sendMessages';

@Scene(SCENES.ACCOUNT_LIST)
@SceneRoles('manager')
export class AccountListScene {
  constructor(
    @Inject(AccountService)
    private readonly accountService: AccountService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: CustomWizardContext): Promise<void> {
    const accounts = await this.accountService.findAll();
    const accountList = accounts
      .map((account, index) => {
        return `${index + 1}. ${account.format('manager')}`;
      })
      .join('\n\n');

    await sendMessage(
      ctx,
      `Счета:\n\n${accountList}`,
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
