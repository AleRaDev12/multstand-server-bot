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
    return this.repository.find({ relations: ['client', 'standOrders'] });
  }

  async getList(): Promise<string | null> {
    const list = await this.findAll();
    if (list.length === 0) return null;

    return list
      .map((item, i) => {
        const standOrdersInfo = item.standOrders
          .map((item, index) => `${index + 1}. ${item.format()}`)
          .join('\n');

        return `${i + 1}.\n${item.format()}\n-Станки-заказы:\n${standOrdersInfo}\n- Клиент:\n${item.client.format()}`;
      })
      .join('\n\n');
  }
}
