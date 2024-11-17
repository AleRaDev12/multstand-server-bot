import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { WorkService } from './work.service';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';
import { SCENES } from '../../../shared/scenes-wizards';
import { UserService } from '../../user/user.service';
import { CustomSceneContext } from '../../../shared/types';
import { sendMessages } from '../../../shared/sendMessages';

@Scene(SCENES.WORK_SHORT_LIST)
@SceneRoles('manager')
export class WorkShortListScene {
  constructor(
    @Inject(WorkService)
    private readonly workService: WorkService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: CustomSceneContext): Promise<void> {
    const user = await this.userService.findByTelegramId(ctx.from.id);
    const userRole = ctx.session.userRole;

    const usersToShow =
      userRole === 'manager'
        ? (await this.userService.findAll()).filter((user) => !!user.master)
        : [user];

    const messages = await Promise.all(
      usersToShow.map(async (user) => {
        const earnings = await this.workService.calculateEarnings(user.id);

        return `🙍🏻‍♂️ Мастер: ${user.name}. Коэффициент: ${user.master.paymentCoefficient}\nОбщий баланс:\nНачислено: ${earnings.totalEarned.toFixed(2)}₽\nВыплачено: ${earnings.alreadyPaid.toFixed(2)}₽\nОсталось выплатить: ${earnings.toPay.toFixed(2)}₽`;
      }),
    );

    await sendMessages(ctx, messages);

    await ctx.scene.leave();
    await ctx.scene.enter(SCENES.MENU);
  }
}
