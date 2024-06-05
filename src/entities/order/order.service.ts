import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { addDays, format, differenceInDays } from 'date-fns';

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

  async getList(): Promise<string> {
    const orders = await this.findAll();
    return orders
      .map((order, i) => this.formatOrder(order, i + 1))
      .join('\n\n');
  }

  private formatOrder(order: Order, index: number): string {
    const { client, contractDate, daysToComplete } = order;
    const deliveryDeadline = addDays(contractDate, daysToComplete);

    const daysUntilSend = differenceInDays(deliveryDeadline, new Date());
    const daysUntilDelivery = '-';

    const clientInfo = [
      `${index}. ${client.firstName} ${client.lastName ?? ''}`,
      client.organization ? `Организация: ${client.organization}` : null,
      `Город: ${client.city}`,
      `Дата заказа: ${format(contractDate, 'yyyy-MM-dd')}`,
      `Крайний срок отправки: ${format(deliveryDeadline, 'yyyy-MM-dd')}, осталось ${daysUntilSend} дней`,
      `Крайний срок доставки: ${daysUntilDelivery}, осталось ${daysUntilDelivery} дней`,
    ].filter(Boolean);

    return clientInfo.join('\n');
  }
}
