import { StandOrderService } from '../stand-order.service';
import { Scene, SceneEnter } from 'nestjs-telegraf';
import { handleButtonPress } from '../../../../shared/helpers';
import { SCENES } from '../../../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { SceneRoles } from '../../../../bot/decorators/scene-roles.decorator';
import { UserService } from '../../../user/user.service';
import { CtxAuth } from '../../../../bot/decorators/ctx-auth.decorator';
import { SceneAuthContext } from '../../../../shared/interfaces';
import { sendMessage } from '../../../../shared/senMessages';
import { StandProdService } from '../../../parts/stand-prod/stand-prod.service';
import { WorkService } from '../../../works/work/work.service';

@Scene(SCENES.STAND_ORDER_ACTIVE_LIST)
@SceneRoles('manager', 'master')
export class StandOrderActiveListScene {
  constructor(
    @Inject(StandOrderService)
    private readonly standOrderService: StandOrderService,
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(StandProdService)
    private readonly standProdService: StandProdService,
    @Inject(WorkService)
    private readonly workService: WorkService,
  ) {}

  @SceneEnter()
  async onSceneEnter(@CtxAuth() ctx: SceneAuthContext): Promise<void> {
    const list = await this.standOrderService.findInProgress();

    if (!list || list.length === 0) {
      await sendMessage(ctx, 'Записей нет');
    } else {
      for (const standOrder of list) {
        let output = `# Изделия / # заказа (на наклейку):\n📝 ${standOrder.id} / ${standOrder.order ? standOrder.order.id : '-'}\n\n`;
        output += `${standOrder.format(ctx.userRole, 'line')}\n\n`;

        // Добавляем информацию о комплектующих
        const components =
          await this.standProdService.findComponentsByStandProd(standOrder.id);
        if (components.length > 0) {
          output += 'Установленные комплектующие:\n';
          components.forEach((comp) => {
            output += `- ${comp.componentName} (${comp.totalCount}шт)\n`;
          });
          output += '\n';
        }

        // Добавляем информацию о выполненных работах
        const works = await this.workService.findWorksByStandOrderId(
          standOrder.id,
        );
        if (works.length > 0) {
          output += 'Выполненные работы:\n';

          // Объединяем работы по типу задачи
          const worksByTask = works.reduce(
            (acc, work) => {
              const taskName = work.task.shownName;
              if (!acc[taskName]) {
                acc[taskName] = 0;
              }
              acc[taskName] += work.count;
              return acc;
            },
            {} as { [key: string]: number },
          );

          // Выводим объединенные работы
          Object.entries(worksByTask).forEach(([taskName, totalCount]) => {
            output += `- ${taskName} (${totalCount}шт)\n`;
          });

          output += '\n';
        }

        await sendMessage(ctx, output);
      }
    }

    await ctx.scene.leave();
    const userRole = ctx.userRole;
    switch (userRole) {
      case 'manager':
        await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.ORDERS));
        break;
      default:
        await handleButtonPress(ctx, () => ctx.scene.enter(SCENES.MENU));
        break;
    }
  }
}
