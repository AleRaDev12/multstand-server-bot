import { Scene, SceneEnter } from 'nestjs-telegraf';
import { Inject } from '@nestjs/common';
import { WorkService } from './work.service';
import { SceneRoles } from '../../../bot/decorators/scene-roles.decorator';
import { SCENES } from '../../../shared/scenes-wizards';
import { UserService } from '../../user/user.service';
import { CtxAuth } from '../../../bot/decorators/ctx-auth.decorator';
import { SceneAuthContext } from '../../../shared/interfaces';
import { sendMessage, sendMessages } from '../../../shared/senMessages';
import { Work } from './work.entity';

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
  async onSceneEnter(@CtxAuth() ctx: SceneAuthContext): Promise<void> {
    const user = await this.userService.findByTelegramId(ctx.from.id);
    const userRole = ctx.userRole;

    const usersToShow =
      userRole === 'manager'
        ? (await this.userService.findAll()).filter(
            (user) => !!user.master.length,
          )
        : [user];

    for (const user of usersToShow) {
      if (userRole === 'manager') {
        const earnings = await this.workService.calculateEarnings(user.id);

        await sendMessage(
          ctx,
          `🙍🏻‍♂️ Мастер: ${user.name}. Коэффициент: ${user.master[0].paymentCoefficient}\nОбщий баланс:\nНачислено: ${earnings.totalEarned.toFixed(2)}₽\nВыплачено: ${earnings.alreadyPaid.toFixed(2)}₽\nОсталось выплатить: ${earnings.toPay.toFixed(2)}₽`,
        );
      }

      const works = await this.workService.findAllByUserId(user.id);

      // Группируем работы по дате
      const worksByDate: { [key: string]: Work[] } = works.reduce(
        (acc, work) => {
          const dateKey = new Date(work.date).toISOString().split('T')[0];
          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey].push(work);
          return acc;
        },
        {} as { [key: string]: Work[] },
      );

      const workList = Object.entries(worksByDate).map(([date, dateWorks]) => {
        let output = `📅 Дата: ${date}\n`;
        let totalCost = 0;

        dateWorks.forEach((work, index) => {
          const workCost = work.cost * work.count * work.paymentCoefficient;
          totalCost += workCost;

          output += `\n${index + 1}. ${work.task.shownName} (#${work.id})\n`;
          output += `   Количество: ${work.count}\n`;
          output += `   Стоимость: ${workCost.toFixed(2)}₽ (${work.cost * work.paymentCoefficient}₽ за ед.`;
          if (userRole === 'manager') {
            output += `, к: ${work.paymentCoefficient}`;
          }
          output += ')\n';

          if (work.standProd) {
            output += '   # Изделия / # заказа (на наклейку):\n';
            const { standProd } = work;
            const { standOrder } = standProd;
            const order = standOrder?.order;

            output += `   📝 ${standProd.id} / ${!standOrder ? '-' : standOrder.id + ':\n      ' + standOrder.format(userRole, 'line')}\n`;
            output += order
              ? `      Заказ клиента #${order.id}\n`
              : 'Заказ клиента: -\n';
          }
        });

        output += `\nИтого за ${date}: ${totalCost.toFixed(2)}₽\n`;
        return output;
      });

      await sendMessages(ctx, workList);
    }

    await ctx.scene.leave();
    await ctx.scene.enter(SCENES.MENU);
  }
}
