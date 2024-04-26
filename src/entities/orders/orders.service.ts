import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async create(order: Order): Promise<Order> {
    return this.ordersRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({ relations: ['client'] });
  }

  async getList(): Promise<string> {
    const orders = await this.findAll();
    return `${orders.map((order, i) => `\n${i + 1}. ${order.id} ${order.contractDate} ${order.client.firstName}`)}`;
  }
}
