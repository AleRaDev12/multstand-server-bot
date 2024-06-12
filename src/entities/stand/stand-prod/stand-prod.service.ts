import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandProd } from './stand-prod.entity';

@Injectable()
export class StandProdService {
  constructor(
    @InjectRepository(StandProd)
    private repository: Repository<StandProd>,
  ) {}

  async create(stand: StandProd): Promise<StandProd> {
    return this.repository.save(stand);
  }

  async findAll(): Promise<StandProd[]> {
    return this.repository.find();
  }

  async getList(): Promise<string | null> {
    const list = await this.findAll();
    if (list.length === 0) return null;
    return `${list.map((standProd, i) => `\n${i + 1}. ${standProd.id} ${standProd.description}`)}`;
  }
}
