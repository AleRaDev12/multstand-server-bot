import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandSet } from './stand-set.entity';

@Injectable()
export class StandSetsService {
  constructor(
    @InjectRepository(StandSet)
    private standSetsRepository: Repository<StandSet>,
  ) {}

  async create(standSet: StandSet): Promise<StandSet> {
    return this.standSetsRepository.save(standSet);
  }

  async findAll(): Promise<StandSet[]> {
    return this.standSetsRepository.find({ relations: ['order'] });
  }
}
