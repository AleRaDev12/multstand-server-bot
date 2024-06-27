import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { addDays } from 'date-fns';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private repository: Repository<Order>,
  ) {}

  async create(order: Order): Promise<Order> {
    return this.repository.save(order);
  }

  async update(order: Order): Promise<Order> {
    return this.repository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.repository.find({ relations: ['client', 'standOrders'] });
  }

  async getFormattedList(): Promise<string[] | null> {
    const list = await this.findAll();
    if (list.length === 0) return null;

    return list.map((item, i) => {
      const standOrdersInfo = item.standOrders
        .map((item, index) => `${index + 1}. ${item.format()}`)
        .join('\n');

      return `${i + 1}.\n${item.format()}\n-Станки-заказы:\n${standOrdersInfo}\n- Клиент:\n${item.client.format()}`;
    });
  }

  async getShortenedFormattedList(): Promise<string[] | null> {
    const list = await this.findAll();
    if (list.length === 0) return null;

    return list.map((item, i) => {
      return `${i + 1}. ${item.formatShorten()}\n${item.client.formatShorten()}\n`;
    });
  }

  async findOneWithRelations(id: number): Promise<Order | undefined> {
    return this.repository.findOne({
      where: { id },
      relations: ['money', 'client', 'standOrders'],
    });
  }

  async updateSendingDeadLineByPaymentDate(orderId: number, paymentDate: Date) {
    const order = await this.findOneWithRelations(orderId);

    if (order) {
      const ifThisIsFirstPayment = order.money.length === 1;
      if (ifThisIsFirstPayment) {
        order.sendingDeadlineDate = addDays(paymentDate, order.daysToSend);
        await this.update(order);
      }
    }
  }
}
