import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandOrder } from './stand-order.entity';

@Injectable()
export class StandOrderService {
  constructor(
    @InjectRepository(StandOrder)
    private standSetsRepository: Repository<StandOrder>,
  ) {}

  async create(standSet: StandOrder): Promise<StandOrder> {
    return this.standSetsRepository.save(standSet);
  }

  async findAll(): Promise<StandOrder[]> {
    return this.standSetsRepository.find({ relations: ['order'] });
  }
}
