import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Work } from './work.entity';

@Injectable()
export class WorkService {
  constructor(
    @InjectRepository(Work)
    private repository: Repository<Work>,
  ) {}

  // Todo: prevent to execute by not manager users
  async create(work: Work): Promise<Work> {
    const partsInReached = { ...work, dateOfReport: new Date() };

    return this.repository.save(partsInReached);
  }

  async findAll(): Promise<Work[]> {
    return this.repository.find({ relations: ['standProd'] });
  }

  async getList(): Promise<string | null> {
    const list = await this.findAll();
    if (list.length === 0) return null;
    return list
      .map(
        (item, i) => `
${i + 1}. ${item.count} units
StandProds: ${item.standProd.map((sp) => sp.description).join(', ')}`,
      )
      .join('\n\n');
  }
}
