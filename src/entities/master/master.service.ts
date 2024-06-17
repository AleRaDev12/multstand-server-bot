import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Master } from './master.entity';

@Injectable()
export class MasterService {
  constructor(
    @InjectRepository(Master)
    private repository: Repository<Master>,
  ) {}

  async findAll(): Promise<Master[]> {
    return this.repository.find({ relations: ['user'] });
  }

  async getList(): Promise<string | null> {
    const list = await this.findAll();
    if (list.length === 0) return null;
    return `${list.map((item, i) => `\n${i + 1}. ${item.user.name} ${item.user.username} ${item.paymentCoefficient}`)}`;
  }
}
