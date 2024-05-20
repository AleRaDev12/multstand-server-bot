import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Money } from './money.entity';

@Injectable()
export class MoneyService {
  constructor(
    @InjectRepository(Money)
    private repository: Repository<Money>,
  ) {}

  async create(money: Money): Promise<Money> {
    return this.repository.save(money);
  }

  async findAll(): Promise<Money[]> {
    return this.repository.find({
      relations: ['order', 'componentPurchase', 'master'],
    });
  }
}
