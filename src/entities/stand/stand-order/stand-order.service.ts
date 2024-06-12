import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandOrder } from './stand-order.entity';

@Injectable()
export class StandOrderService {
  constructor(
    @InjectRepository(StandOrder)
    private repository: Repository<StandOrder>,
  ) {}

  async create(standSet: StandOrder): Promise<StandOrder> {
    return this.repository.save(standSet);
  }

  async findAll(): Promise<StandOrder[]> {
    return this.repository.find({ relations: ['order'] });
  }

  async getList(): Promise<string | null> {
    const list = await this.findAll();
    if (list.length === 0) return null;

    return `${list.map((standOrder, i) => `\n${i + 1}. ${standOrder.id} ${standOrder.model} ${standOrder.glassesRegular}ос ${standOrder.glassesHighTransparency}пп ${standOrder.painting}`)}`;
  }
}
