import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandProd } from './stand-prod.entity';
import { UserRole } from '../../../shared/types';
import { PartOut } from '../part-out/part-out.entity';
import { WorkService } from '../../works/work/work.service';
import { StandOrder } from '../../orders/stand-order/stand-order.entity';
import { Work } from '../../works/work/work.entity';

interface ComponentSummary {
  componentName: string;
  totalCount: number;
  unitCost: number;
  totalCost: number;
}

@Injectable()
export class StandProdService {
  constructor(
    @InjectRepository(StandProd)
    private repository: Repository<StandProd>,
    @InjectRepository(PartOut)
    private partOutRepository: Repository<PartOut>,
    @Inject(WorkService)
    private readonly workService: WorkService,
  ) {}

  async create(standProd: StandProd): Promise<StandProd> {
    return this.repository.save(standProd);
  }

  async findAll(): Promise<StandProd[]> {
    return this.repository.find({
      relations: ['standOrder', 'work', 'standOrder.order'],
      order: {
        id: 'ASC',
      },
    });
  }

  async findActive(): Promise<StandProd[]> {
    return this.repository.find({
      where: {
        isActive: true,
      },
      relations: ['standOrder', 'work', 'standOrder.order'],
      order: {
        id: 'ASC',
      },
    });
  }

  async findNotLinked(): Promise<StandProd[]> {
    return this.repository.find({
      where: {
        standOrder: null,
      },
      relations: ['standOrder', 'work', 'standOrder.order'],
      order: {
        id: 'ASC',
      },
    });
  }

  async formatSingle(
    standProd: StandProd,
    userRole: UserRole,
  ): Promise<string> {
    return this.formatSingleWithRole(standProd, userRole);
  }

  async findComponentsByStandProd(
    standProdId: number,
  ): Promise<ComponentSummary[]> {
    const partOuts = await this.partOutRepository.find({
      where: { standProd: { id: standProdId } },
      relations: ['partIn', 'partIn.component'],
    });

    const componentMap: { [componentName: string]: ComponentSummary } = {};

    for (const partOut of partOuts) {
      const componentName = partOut.partIn.component.name;
      const unitCost = partOut.partIn.amount / partOut.partIn.count;
      const totalCost = unitCost * partOut.count;

      if (componentMap[componentName]) {
        componentMap[componentName].totalCount += partOut.count;
        componentMap[componentName].totalCost += totalCost;
      } else {
        componentMap[componentName] = {
          componentName,
          totalCount: partOut.count,
          unitCost,
          totalCost,
        };
      }
    }

    return Object.values(componentMap);
  }

  async formatList(list: StandProd[], userRole: UserRole): Promise<string[]> {
    const formattedList: string[] = [];

    for (const standProd of list) {
      const formatted = await this.formatSingleWithRole(standProd, userRole);
      formattedList.push(formatted);
    }

    return formattedList;
  }

  private async formatSingleWithRole(
    standProd: StandProd,
    userRole: UserRole,
  ): Promise<string> {
    const standOrder: StandOrder | undefined = standProd.standOrder;
    const order = standOrder?.order;

    let output = `📝️ ️️️️️️️️${standProd.id} / ${standOrder ? standOrder.id + '\n' + standOrder.format(userRole, 'line') : '-'}  -  # Изделия / # заказа (на наклейку)\n\n`;
    output += order ? `Заказ клиента #${order.id}\n` : '';

    output += '\n🛠 Комплектация:\n';
    if (standOrder) {
      output += standOrder.format(userRole, 'full');
      output += '\n';
    } else {
      output += '-\n';
    }

    const components = await this.findComponentsByStandProd(standProd.id);
    output += '\n🛠 Компоненты:\n';

    let totalComponentsCost = 0;
    if (components.length === 0) {
      output += '-\n';
    } else {
      components.forEach((comp) => {
        output += `- ${comp.componentName} (${comp.totalCount}ед)\n`;
        if (userRole === 'manager') {
          output += `  По ~${comp.unitCost.toFixed(2)} ₽, итого: ${comp.totalCost.toFixed(2)} ₽\n`;
          totalComponentsCost += comp.totalCost;
        }
      });

      if (userRole === 'manager') {
        output += `\nОбщая стоимость комплектующих: ${totalComponentsCost.toFixed(2)} ₽\n`;
      }
    }

    output += '\n💼 Выполненная работа:\n';
    const worksForCurrentStandProd =
      await this.workService.getWorksForStandProd(standProd.id);

    let totalWorkCost = 0;
    if (worksForCurrentStandProd.length === 0) {
      output += '-\n\n';
    } else {
      // Группируем работы по задачам
      const worksByTask = worksForCurrentStandProd.reduce(
        (acc, work) => {
          const taskName = work.task.shownName;
          if (!acc[taskName]) {
            acc[taskName] = {
              works: [],
              taskId: work.task.id, // Сохраняем id задачи
            };
          }
          acc[taskName].works.push(work);
          return acc;
        },
        {} as Record<string, { works: Work[]; taskId: number }>,
      );

      // Сортируем задачи по id
      const sortedTaskEntries = Object.entries(worksByTask).sort(
        (a, b) => a[1].taskId - b[1].taskId,
      );

      // Выводим работы, сгруппированные по задачам
      for (const [taskName, { works: taskWorks }] of sortedTaskEntries) {
        output += `* ${taskName}:\n`;
        let taskTotalCost = 0;
        let taskTotalCount = 0;

        for (const work of taskWorks) {
          taskTotalCount += work.count;

          let workDescription = `  - ${work.count}шт`;
          workDescription += ` - ${work.master.user?.name || 'Неизвестный мастер'}`;
          workDescription += ` #${work.id}`;

          output += workDescription + '\n';

          if (userRole === 'manager') {
            const workCost = work.cost * work.count * work.paymentCoefficient;
            output += `    Оплата: ${workCost.toFixed(2)} ₽\n`;
            taskTotalCost += workCost;
            totalWorkCost += workCost;
          }
        }

        if (userRole === 'manager') {
          output += `  Итого по задаче (${taskTotalCount}ед): ${taskTotalCost.toFixed(2)} ₽\n`;
        }
        output += '\n';
      }

      if (userRole === 'manager') {
        output += `Общая стоимость работ: ${totalWorkCost.toFixed(2)} ₽\n`;

        const totalCost = totalComponentsCost + totalWorkCost;
        output += `\n💰 Общая стоимость: ${totalCost.toFixed(2)} ₽\n`;
      }
    }

    return output;
  }

  // TODO: We should optimize this, separate some logic to functions
  async getStandProdsWithWorksByMaster(
    userId: number,
    userRole: UserRole,
  ): Promise<string[]> {
    const works = await this.workService.getWorksByMaster(userId);

    const standProdMap = new Map<
      number,
      {
        standProd: StandProd;
        works: Work[];
        totalCost: number;
      }
    >();

    for (const work of works) {
      const standProdId = work.standProd.id;
      if (!standProdMap.has(standProdId)) {
        standProdMap.set(standProdId, {
          standProd: work.standProd,
          works: [],
          totalCost: 0,
        });
      }
      const entry = standProdMap.get(standProdId);
      entry.works.push(work);
      const workCost = work.cost * work.count * work.paymentCoefficient;
      entry.totalCost += workCost;
    }

    const result: string[] = [];

    for (const [, { standProd, works, totalCost }] of standProdMap) {
      let output = `# Изделия / # заказа (на наклейку):\n📝️ ️️️️️️️️${standProd.id} / ${standProd.standOrder ? standProd.standOrder.id : '-'}\n`;
      output += standProd.standOrder
        ? standProd.standOrder.format(userRole, 'line')
        : '';
      output += '\n';
      output += `Заказ клиента #${standProd.standOrder?.order?.id || '-'}\n\n`;

      output += 'Список выполненных задач:\n';

      for (const work of works) {
        const workCost = work.cost * work.count * work.paymentCoefficient;
        output += `- ${work.task.shownName} (${work.count}ед)\n`;
        output += `  Оплата: ${workCost.toFixed(2)} ₽\n`;
      }

      output += `Итого по изделию: ${totalCost.toFixed(2)} ₽\n`;

      result.push(output);
    }

    const grandTotal = Array.from(standProdMap.values()).reduce(
      (sum, { totalCost }) => sum + totalCost,
      0,
    );
    result.push(`Общая сумма всех работ: ${grandTotal.toFixed(2)} ₽`);

    return result;
  }
}
