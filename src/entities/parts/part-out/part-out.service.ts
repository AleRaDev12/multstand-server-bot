import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartOut } from './part-out.entity';
import { PartIn } from '../part-in/part-in.entity';
import { UserRole } from '../../../shared/types';

@Injectable()
export class PartOutService {
  constructor(
    @InjectRepository(PartOut)
    private repository: Repository<PartOut>,
    @InjectRepository(PartIn)
    private partInRepository: Repository<PartIn>,
  ) {}

  async create(PartOut: PartOut): Promise<PartOut> {
    return this.repository.save(PartOut);
  }

  async findAll(): Promise<PartOut[]> {
    return this.repository.find({ relations: ['partIn', 'partIn.component'] });
  }

  async getList(userRole: UserRole): Promise<string | null> {
    const list = await this.findAll();
    if (list.length === 0) return null;
    return this.formatPartOutList(list, userRole);
  }

  async findByComponent(componentId: number): Promise<PartOut[]> {
    return this.repository.find({
      where: { partIn: { component: { id: componentId } } },
      relations: ['partIn', 'partIn.component'],
    });
  }

  async findRemainingPartIn(): Promise<
    { partIn: PartIn; remainingCount: number }[]
  > {
    const partsIn = await this.partInRepository.find({
      relations: ['partsOut', 'component'],
    });

    const result = partsIn
      .map((partIn) => {
        const totalPartOutCount = partIn.partsOut.reduce(
          (sum, partOut) => sum + partOut.count,
          0,
        );
        const remainingCount = partIn.count - totalPartOutCount;
        return { partIn, remainingCount };
      })
      .filter((item) => item.remainingCount > 0);

    return result;
  }

  async findRemainingPartInByComponent(
    componentId: number,
  ): Promise<{ partIn: PartIn; remainingCount: number }[]> {
    const remainingPartsIn = await this.findRemainingPartIn();
    return remainingPartsIn.filter(
      (item) => item.partIn.component.id === componentId,
    );
  }

  async getRemainingListByComponent(
    componentId: number,
  ): Promise<string | null> {
    const list = await this.findRemainingPartInByComponent(componentId);
    if (list.length === 0) return null;
    return this.formatRemainingPartInList(list);
  }

  private formatPartOutList = (list: PartOut[], userRole: UserRole): string => {
    return list
      .map(
        (item, i) =>
          `${i + 1}.\n${item.partIn.component.format(userRole)}\n${item.format(userRole)}`,
      )
      .join('\n\n');
  };

  private formatRemainingPartInList = (
    list: { partIn: PartIn; remainingCount: number }[],
  ): string => {
    return list
      .map(
        ({ partIn, remainingCount }, i) =>
          `${i + 1}.\n${partIn.format()}\nRemaining Count: ${remainingCount}`,
      )
      .join('\n\n');
  };

  async findComponentsByStandProd(standProdId: number): Promise<PartOut[]> {
    return this.repository.find({
      where: { standProd: { id: standProdId } },
      relations: ['partIn', 'partIn.component'],
    });
  }
}
