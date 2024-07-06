import { Scene, SceneEnter } from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { Inject } from '@nestjs/common';
import { WorkService } from './work.service';
import {
  CtxWithUserId,
  SceneContextWithUserId,
} from '../../../bot/decorators/ctx-with-user-id.decorator';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';
import { SCENES } from '../../../shared/scenes-wizards';
import { UserService } from '../../user/user.service';

@Scene(SCENES.WORK_LIST)
@SceneRoles('manager', 'master')
export class WorkListScene {
  constructor(
    @Inject(WorkService)
    private readonly workService: WorkService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @SceneEnter()
  async onSceneEnter(
    @CtxWithUserId() ctx: SceneContextWithUserId,
  ): Promise<void> {
    const user = await this.userService.findByTelegramId(ctx.telegramUserId);

    const userRole = user.role;

    const usersToShow =
      userRole === 'manager'
        ? (await this.userService.findAll()).filter(
            (user) => !!user.master.length,
          )
        : [user];

    for (const user of usersToShow) {
      if (userRole === 'manager')
        await ctx.reply(
          `🙍🏻‍♂️ Пользователь: ${user.name}. Актуальный коэффициент: ${user.master[0].paymentCoefficient}`,
        );
      const works = await this.workService.findAllByUserId(user.id);

      const earnings = await this.workService.calculateEarnings(user.id);

      const workList = works.map((work, index) => {
        const standProds = work.standProd
          .map((sp) => sp.format(userRole))
          .join(', ');

        return `${index + 1}. ${work.task.shownName}\nДата: ${work.date}\nКоличество: ${work.count}\n\nСтанки: ${standProds}\n\nСтанки-заказы:\n${work.standProd.map((item) => `${item?.standOrder?.format(userRole)}\n`)}\n\nОплата: ${work.cost * work.count * work.paymentCoefficient}₽ (по ${work.cost * work.paymentCoefficient}₽${userRole === 'manager' ? ` к: ${work.paymentCoefficient}` : ''})\n\n`;
      });

      await ctx.reply(
        `Начислено: ${earnings.totalEarned}\nВыплачено: ${earnings.alreadyPaid}\nОсталось выплатить: ${earnings.toPay}\n\nВыполненные задачи:`,
      );
      for (const work of workList) {
        await ctx.reply(work);
      }
    }

    await ctx.scene.leave();
    await ctx.scene.enter(SCENES.MENU);
  }
}
