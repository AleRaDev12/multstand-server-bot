import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandOrder } from './stand-order.entity';
import { StandOrderStatus, StandOrderStatusKeyType } from './stand-order-types';

@Injectable()
export class StandOrderService {
  constructor(
    @InjectRepository(StandOrder)
    private repository: Repository<StandOrder>,
  ) {}

  async create(standOrder: StandOrder): Promise<StandOrder> {
    if (!standOrder.status) standOrder.status = StandOrderStatus.Preliminary;
    return this.repository.save(standOrder);
  }

  async findAll(): Promise<StandOrder[]> {
    return this.repository.find({ relations: ['order'] });
  }

  async findInProgress(): Promise<StandOrder[]> {
    const statusKey: StandOrderStatusKeyType = 'InProgress';
    return this.repository.find({
      where: {
        status: StandOrderStatus[statusKey],
      },
      relations: ['order'],
    });
  }

  formatSingle(standOrder: StandOrder): string {
    return `${standOrder.formatShorten()}\n-Заказ:\n${standOrder.order.formatShorten()}`;
  }

  formatList(standOrders: StandOrder[]): string[] {
    if (standOrders.length === 0) return null;

    return standOrders.map(
      (standOrder, i) => `\n${i + 1}. ${this.formatSingle(standOrder)}`,
    );
  }
}
