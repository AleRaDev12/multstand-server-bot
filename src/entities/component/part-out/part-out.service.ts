import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartOut } from './part-out.entity';

@Injectable()
export class PartOutService {
  constructor(
    @InjectRepository(PartOut)
    private repository: Repository<PartOut>,
  ) {}

  async create(PartOut: PartOut): Promise<PartOut> {
    return this.repository.save(PartOut);
  }

  async findAll(): Promise<PartOut[]> {
    return this.repository.find({ relations: ['partIn', 'partIn.component'] });
  }

  async getList(): Promise<string | null> {
    const list = await this.findAll();
    if (list.length === 0) return null;

    return list
      .map(
        (item, i) =>
          `${i + 1}.\n${item.partIn.component.format()}\n${item.format()}`,
      )
      .join('\n\n');
  }
}
