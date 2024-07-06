import { StandProd } from './stand-prod/stand-prod.entity';
import { Component } from './component/component.entity';
import { PartIn } from './part-in/part-in.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartOut } from './part-out/part-out.entity';

type RemainingComponent = {
  component: Component;
  inStockCount: number;
  inTransitCount: number;
};

type RemainingPartsIn = {
  partIn: PartIn;
  inStockCount: number;
  inTransitCount: number;
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
    const remainingList: RemainingComponent[] = await Promise.all(
      components.map(async (component) => {
        const partsIn = await this.partInRepository.find({
          where: { component: { id: component.id } },
          relations: ['partsOut'],
        });

        let inStockCount = 0;
        let inTransitCount = 0;

        partsIn.forEach((partIn) => {
          const totalPartOutCount = partIn.partsOut.reduce(
            (sum, partOut) => sum + partOut.count,
            0,
          );
          const remainingCount = partIn.count - totalPartOutCount;

          if (partIn.dateArrival) {
            inStockCount += remainingCount;
          } else {
            inTransitCount += remainingCount;
          }
        });

        return { component, inStockCount, inTransitCount };
      }),
    );

    return remainingList.filter(
      (item) => item.inStockCount > 0 || item.inTransitCount > 0,
    );
  }

  formatRemainingList(remainingList: RemainingComponent[]): string[] {
    return remainingList.map((item) => {
      const inTransitText =
        item.inTransitCount > 0 ? `\n+${item.inTransitCount} в доставке` : '';
      return `ID: ${item.component.id}\n${item.component.name} (${item.component.type})\nОстаток: ${item.inStockCount}${inTransitText}`;
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
        return {
          partIn,
          inStockCount: partIn.dateArrival ? remainingCount : 0,
          inTransitCount: partIn.dateArrival ? 0 : remainingCount,
        };
      })
      .filter((item) => item.inStockCount > 0 || item.inTransitCount > 0);
  }

  formatRemainingPartInList(list: RemainingPartsIn[]): string[] {
    return list.map(({ partIn, inStockCount, inTransitCount }) => {
      const inTransitText =
        inTransitCount > 0 ? ` +${inTransitCount} в доставке` : '';
      return `${partIn.format()}\nОсталось: ${inStockCount}${inTransitText}`;
    });
  }

  async getTotalRemainingCount(
    componentId: number,
  ): Promise<{ inStock: number; inTransit: number }> {
    const remainingList = await this.getRemainingListByComponent(componentId);
    return remainingList.reduce(
      (sum, item) => ({
        inStock: sum.inStock + item.inStockCount,
        inTransit: sum.inTransit + item.inTransitCount,
      }),
      { inStock: 0, inTransit: 0 },
    );
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

      const writeOffCount = Math.min(remainingCount, item.inStockCount);
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
