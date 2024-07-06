import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartIn } from './part-in.entity';

@Injectable()
export class PartInService {
  constructor(
    @InjectRepository(PartIn)
    private repository: Repository<PartIn>,
  ) {}

  async create(partIn: PartIn): Promise<PartIn> {
    return this.repository.save(partIn);
  }

  async findAll(): Promise<PartIn[]> {
    return this.repository.find({ relations: ['component'] });
  }

  async getList(): Promise<string | null> {
    const list = await this.findAll();
    if (list.length === 0) return null;

    return list
      .map(
        (item, i) => `${i + 1}.\n${item.component.format()}\n${item.format()}`,
      )
      .join('\n\n');
  }

  async getFormattedList(): Promise<string[] | null> {
    const list = await this.findAll();
    if (list.length === 0) return null;

    return list.map(
      (item, i) => `№${i + 1}.\n${item.component.format()}\n${item.format()}`,
    );
  }
}
