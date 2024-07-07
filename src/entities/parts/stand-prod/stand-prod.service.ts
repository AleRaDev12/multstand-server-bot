import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../../user/user.service';
import { StandProd } from './stand-prod.entity';
import { UserRole } from '../../../shared/interfaces';
import { PartOut } from '../part-out/part-out.entity';

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
    @Inject(UserService)
    private readonly userService: UserService,
    @InjectRepository(PartOut)
    private partOutRepository: Repository<PartOut>,
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
    const orderStateText = standProd?.standOrder?.order
      ? `💼 Статус заказа: ${standProd?.standOrder?.order?.status}`
      : '💼 Заказ: -';

    let componentsInfo = '';
    const components = await this.findComponentsByStandProd(standProd.id);

    if (userRole === 'manager') {
      const totalCost = components.reduce(
        (sum, comp) => sum + comp.totalCost,
        0,
      );
      componentsInfo = components
        .map((comp) => {
          return `- ${comp.componentName} (${comp.totalCount}ед, по ~: ${comp.unitCost.toFixed(2)} руб, итого: ${comp.totalCost.toFixed(2)})`;
        })
        .join('\n');
      componentsInfo = `\n\n🛠 Компоненты:\n${componentsInfo}\nСуммарная стоимость: ${totalCost.toFixed(2)}`;
    } else {
      componentsInfo = components
        .map((comp) => {
          return `- ${comp.componentName} (${comp.totalCount}ед)`;
        })
        .join('\n');
      componentsInfo = `\n\n🛠 Компоненты:\n${componentsInfo}`;
    }

    return `${standProd.format(userRole)}\n\n${orderStateText}${componentsInfo}\n\n🛠 Станок-заказ:\n${standProd.standOrder?.format(userRole) || '-'}`;
  }
}
