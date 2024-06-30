import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Component } from './component/component.entity';
import { PartOut } from './part-out/part-out.entity';
import { PartIn } from './part-in/part-in.entity';

@Injectable()
export class ComponentsService {
  constructor(
    @InjectRepository(Component)
    private repository: Repository<Component>,
    @InjectRepository(PartIn)
    private partInRepository: Repository<PartIn>,
    @InjectRepository(PartOut)
    private partOutRepository: Repository<PartOut>,
  ) {}

  async getRemainingList(): Promise<string[]> {
    const components = await this.repository.find();
    const remainingList = await Promise.all(
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

        return remaining !== 0
          ? `${component.name} ${component.type}: ${remaining}`
          : '';
      }),
    );

    return remainingList.filter(Boolean);
  }
}
