import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private repository: Repository<Order>,
  ) {}

  async create(order: Order): Promise<Order> {
    return this.repository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.repository.find({ relations: ['client'] });
  }

  async getList(): Promise<string | null> {
    const list = await this.findAll();
    if (list.length === 0) return null;

    return list
      .map(
        (item, i) =>
          `${i + 1}.\n${item.format()}\n- Клиент:\n${item.client.format()}`,
      )
      .join('\n\n');
  }
}
