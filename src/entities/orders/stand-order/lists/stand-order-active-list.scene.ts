import { StandOrderService } from '../stand-order.service';
import { Scene, SceneEnter } from 'nestjs-telegraf';
import { handleButtonPress } from '../../../../shared/helpers';
import { SCENES } from '../../../../shared/scenes-wizards';
import { Inject } from '@nestjs/common';
import { SceneRoles } from '../../../../bot/decorators/scene-roles.decorator';
import { UserService } from '../../../user/user.service';
import { CtxAuth } from '../../../../bot/decorators/ctx-auth.decorator';
import { SceneAuthContext } from '../../../../shared/interfaces';
import { sendMessage, sendMessages } from '../../../../shared/sendMessages';
import { StandProdService } from '../../../parts/stand-prod/stand-prod.service';
import { WorkService } from '../../../works/work/work.service';
import { getEmitOutput } from 'ts-loader/dist/instances';
import { generateOrderDeadline } from '../../order/order-formatting';
import { format } from 'date-fns';

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
      const formattedOrders: string[] = [];
      for (const standOrder of list) {
        let output = '';
        if (standOrder.standProd?.length > 1) {
          output += 'Ошибка. Несколько изделий на один заказ';
          continue;
        }

        output += `${standOrder.format(ctx.userRole, 'line')}\n\n`;
        output += `# Изделия / # заказа (на наклейку):\n📝 ${standOrder.standProd.length ? standOrder.standProd[0].id : '-'} / ${standOrder.id}\n\n`;

        if (standOrder.order) {
          if (ctx.userRole === 'manager') {
            output += `📅 Дата договора: ${format(standOrder.order.contractDate, 'yyyy-MM-dd')}\n`;
            if (standOrder.order.client) {
              const client = standOrder.order.client;
              output += `👤 Клиент: ${client.firstName ?? ''} ${client.lastName ?? ''}\n${client.phoneNumber}\n`;
              if (client.organization) {
                output += `🏢 Организация: ${client.organization}\n`;
              }
              output += `🏙 Город: ${client.city}\n`;
            }
          }
        } else {
          output += 'Order: -\n';
        }

        output += generateOrderDeadline(standOrder.order).join('\n');
        output += '\n';

        output += '\n🛠 Комплектация:\n';
        if (standOrder) {
          output += standOrder.format(ctx.userRole, 'full');
          output += `\nСтоимость с доставкой: ${standOrder.cost + standOrder.deliveryCost}\n`;
          output += '\n';
        } else {
          output += '-\n';
        }

        let totalComponentsCost = 0;
        let totalWorkCost = 0;

        // Добавляем информацию о комплектующих
        const components =
          await this.standProdService.findComponentsByStandProd(standOrder.id);
        if (components.length > 0) {
          output += '\n🛠 Установленные комплектующие:\n';
          components.forEach((comp) => {
            output += `- ${comp.componentName} (${comp.totalCount}шт)`;
            if (ctx.userRole === 'manager') {
              const componentCost = comp.unitCost * comp.totalCount;
              output += ` - ${componentCost.toFixed(2)} ₽`;
              totalComponentsCost += componentCost;
            }
            output += '\n';
          });
          if (ctx.userRole === 'manager') {
            output += `Себестоимость комплектующих: ${totalComponentsCost.toFixed(2)} ₽\n`;
          }
          output += '\n';
        }

        // Добавляем информацию о выполненных работах
        const works = await this.workService.findWorksByStandOrderId(
          standOrder.id,
        );
        if (works.length > 0) {
          output += '🔧 Выполненные работы:\n';

          // Объединяем работы по типу задачи
          const worksByTask = works.reduce(
            (acc, work) => {
              const taskName = work.task.shownName;
              if (!acc[taskName]) {
                acc[taskName] = { count: 0, cost: 0 };
              }
              acc[taskName].count += work.count;
              if (ctx.userRole === 'manager') {
                const workCost =
                  work.cost * work.count * work.paymentCoefficient;
                acc[taskName].cost += workCost;
                totalWorkCost += workCost;
              }
              return acc;
            },
            {} as { [key: string]: { count: number; cost: number } },
          );

          // Выводим объединенные работы
          Object.entries(worksByTask).forEach(([taskName, { count, cost }]) => {
            output += `- ${taskName} (${count}шт)`;
            if (ctx.userRole === 'manager') {
              output += ` - ${cost.toFixed(2)} ₽`;
            }
            output += '\n';
          });

          if (ctx.userRole === 'manager') {
            output += `Себестоимость работ: ${totalWorkCost.toFixed(2)} ₽\n`;
          }
          output += '\n';
        }

        if (ctx.userRole === 'manager') {
          const totalCost = totalComponentsCost + totalWorkCost;
          output += `💰 Себестоимость всего изделия: ${totalCost.toFixed(2)} ₽\n`;
        }
        formattedOrders.push(output);
      }

      await sendMessages(ctx, formattedOrders);
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
