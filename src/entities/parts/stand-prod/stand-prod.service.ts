import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandProd } from './stand-prod.entity';
import { UserRole } from '../../../shared/interfaces';
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
    });
  }

  async findNotLinked(): Promise<StandProd[]> {
    return this.repository.find({
      where: {
        standOrder: null,
      },
      relations: ['standOrder', 'work', 'standOrder.order'],
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

    let output = `# Изделия / # заказа (на наклейку):\n📝️ ️️️️️️️️${standProd.id} / ${standOrder ? standOrder.id + '\n' + standOrder.format(userRole, 'line') : '-'}\n\n`;
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
      // Группируем работы по мастерам
      const worksByMaster = worksForCurrentStandProd.reduce(
        (acc, work) => {
          const masterName = work.master.user?.name || 'Неизвестный мастер';
          if (!acc[masterName]) {
            acc[masterName] = [];
          }
          acc[masterName].push(work);
          return acc;
        },
        {} as Record<string, Work[]>,
      );

      // Выводим работы, сгруппированные по мастерам
      for (const [masterName, masterWorks] of Object.entries(worksByMaster)) {
        output += `* ${masterName}:\n`;
        let masterTotalCost = 0;

        for (const work of masterWorks) {
          // Получаем все standProd, связанные с этой работой
          const allLinkedStandProds =
            await this.workService.getStandProdsForWork(work.id);
          const linkedStandProdsCount = allLinkedStandProds.length;

          let workDescription = `  - ${work.task.shownName} (${work.count}ед`;

          if (linkedStandProdsCount > 1) {
            const otherStandProdIds = allLinkedStandProds
              .filter((sp) => sp.id !== standProd.id)
              .map((sp) => sp.id)
              .join(' #');
            workDescription += ` - на ${linkedStandProdsCount} изделия #${standProd.id} #${otherStandProdIds}`;
          }

          workDescription += `)`;

          // Добавляем ID работы
          workDescription += ` #${work.id}`;

          output += workDescription + '\n';

          if (userRole === 'manager') {
            const workCost = work.cost * work.count * work.paymentCoefficient;
            output += `    Стоимость: ${(workCost / linkedStandProdsCount).toFixed(2)} ₽${linkedStandProdsCount ? ` из расчёта  ${linkedStandProdsCount} шт` : ''}\n`;
            masterTotalCost += workCost;
            totalWorkCost += workCost;
          }
        }

        if (userRole === 'manager') {
          output += `  Итого по мастеру: ${masterTotalCost.toFixed(2)} ₽\n`;
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

  async getStandProdsWithWorksByMaster(userId: number): Promise<string[]> {
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
      for (const standProd of work.standProd) {
        if (!standProdMap.has(standProd.id)) {
          standProdMap.set(standProd.id, {
            standProd,
            works: [],
            totalCost: 0,
          });
        }
        const entry = standProdMap.get(standProd.id);
        entry.works.push(work);
        const workCost = work.cost * work.count * work.paymentCoefficient;
        entry.totalCost += workCost;
      }
    }

    const result: string[] = [];

    for (const [, { standProd, works, totalCost }] of standProdMap) {
      let output = `# Изделия / # заказа (на наклейку):\n📝️ ️️️️️️️️${standProd.id} / ${standProd.standOrder ? standProd.standOrder.id : '-'}\n\n`;
      output += `Заказ клиента #${standProd.standOrder?.order?.id || '-'}\n`;

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
