import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Component } from './component/component.entity';
import { PartOut } from './part-out/part-out.entity';
import { PartIn } from './part-in/part-in.entity';
import { StandProd } from './stand-prod/stand-prod.entity';

type RemainingComponent = {
  component: Component;
  remainingCount: number;
};

type RemainingPartsIn = {
  partIn: PartIn;
  remainingCount: number;
};

@Injectable()
export class PartsService {
  constructor(
    @InjectRepository(Component)
    private componentRepository: Repository<Component>,
    @InjectRepository(PartIn)
    private partInRepository: Repository<PartIn>,
    @InjectRepository(PartOut)
    private partOutRepository: Repository<PartOut>,
  ) {}

  async getRemainingList(): Promise<RemainingComponent[]> {
    const components = await this.componentRepository.find();
    const remainingList: (RemainingComponent | null)[] = await Promise.all(
      components.map(async (component) => {
        const totalIn = await this.partInRepository
          .createQueryBuilder('partIn')
          .where('partIn.componentId = :componentId', {
            componentId: component.id,
          })
          .select('SUM(partIn.count)', 'total')
          .getRawOne();

        const totalOut = await this.partOutRepository
          .createQueryBuilder('partOut')
          .leftJoin('partOut.partIn', 'partIn')
          .where('partIn.componentId = :componentId', {
            componentId: component.id,
          })
          .select('SUM(partOut.count)', 'total')
          .getRawOne();

        const remaining = (totalIn?.total || 0) - (totalOut?.total || 0);

        if (remaining === 0) return null;
        return { component, remainingCount: remaining };
      }),
    );

    return remainingList.filter(Boolean);
  }

  formatRemainingList(remainingList: RemainingComponent[]): string[] {
    return remainingList.map((item) => {
      return `Номер комплектующего: ${item.component.id}\n${item.component.name} (${item.component.type})\nОстаток: ${item.remainingCount}`;
    });
  }

  async getRemainingListByComponent(
    componentId: number,
  ): Promise<RemainingPartsIn[]> {
    const partsIn = await this.partInRepository.find({
      where: { component: { id: componentId } },
      relations: ['partsOut', 'component'],
    });

    return partsIn
      .map((partIn) => {
        const totalPartOutCount = partIn.partsOut.reduce(
          (sum, partOut) => sum + partOut.count,
          0,
        );
        const remainingCount = partIn.count - totalPartOutCount;
        return { partIn, remainingCount };
      })
      .filter((item) => item.remainingCount !== 0);
  }

  formatRemainingPartInList(list: RemainingPartsIn[]): string[] {
    return list.map(
      ({ partIn, remainingCount }) =>
        `${partIn.format()}\nОсталось: ${remainingCount}`,
    );
  }

  async getTotalRemainingCount(componentId: number): Promise<number> {
    const remainingList = await this.getRemainingListByComponent(componentId);
    return remainingList.reduce((sum, item) => sum + item.remainingCount, 0);
  }

  async writeOffComponents(
    componentId: number,
    count: number,
    date: Date,
    standProd: StandProd,
  ): Promise<PartOut[]> {
    const remainingList = await this.getRemainingListByComponent(componentId);
    let remainingCount = count;
    const partOuts: PartOut[] = [];

    for (const item of remainingList) {
      if (remainingCount <= 0) break;

      const writeOffCount = Math.min(remainingCount, item.remainingCount);
      const partOut = new PartOut();
      partOut.partIn = item.partIn;
      partOut.count = writeOffCount;
      partOut.date = date;
      partOut.standProd = standProd;

      partOuts.push(partOut);
      remainingCount -= writeOffCount;
    }

    if (remainingCount > 0) {
      throw new Error('Недостаточно компонентов для списания');
    }

    return this.partOutRepository.save(partOuts);
  }

  async writeOffFromSpecificPartIn(
    partInId: number,
    count: number,
  ): Promise<PartOut> {
    const partIn = await this.partInRepository.findOne({
      where: { id: partInId },
      relations: ['partsOut'],
    });

    if (!partIn) {
      throw new Error('Партия не найдена');
    }

    const remainingCount =
      partIn.count - partIn.partsOut.reduce((sum, po) => sum + po.count, 0);

    if (remainingCount < count) {
      throw new Error('Недостаточно компонентов в выбранной партии');
    }

    const partOut = new PartOut();
    partOut.partIn = partIn;
    partOut.count = count;
    partOut.date = new Date();

    return this.partOutRepository.save(partOut);
  }

  async writeOffFromMultiplePartIns(
    partInIds: number[],
    totalCount: number,
    date: Date,
    standProd: StandProd,
  ): Promise<PartOut[]> {
    let remainingCount = totalCount;
    const partOuts: PartOut[] = [];

    for (const partInId of partInIds) {
      if (remainingCount <= 0) break;

      const partIn = await this.partInRepository.findOne({
        where: { id: partInId },
        relations: ['partsOut'],
      });

      if (!partIn) {
        throw new Error(`Партия с ID ${partInId} не найдена`);
      }

      const availableCount =
        partIn.count - partIn.partsOut.reduce((sum, po) => sum + po.count, 0);
      const writeOffCount = Math.min(remainingCount, availableCount);

      if (writeOffCount > 0) {
        const partOut = new PartOut();
        partOut.partIn = partIn;
        partOut.count = writeOffCount;
        partOut.date = date;
        partOut.standProd = standProd;

        const savedPartOut = await this.partOutRepository.save(partOut);
        partOuts.push(savedPartOut);
        remainingCount -= writeOffCount;
      }
    }

    if (remainingCount > 0) {
      throw new Error(
        `Не удалось списать все компоненты. Осталось списать: ${remainingCount}`,
      );
    }

    return partOuts;
  }
}
