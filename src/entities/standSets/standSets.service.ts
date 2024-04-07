import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandSet } from './standSet.entity';

@Injectable()
export class StandSetsService {
  constructor(
    @InjectRepository(StandSet)
    private standsRepository: Repository<StandSet>,
  ) {}

  async create(work: StandSet): Promise<StandSet> {
    const partsInReached = { ...work, dateOfReport: new Date() };

    return this.standsRepository.save(partsInReached);
  }

  async findAll(): Promise<StandSet[]> {
    return this.standsRepository.find();
  }
}
