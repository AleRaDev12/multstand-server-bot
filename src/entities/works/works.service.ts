import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Work } from './work.entity';

@Injectable()
export class WorksService {
  constructor(
    @InjectRepository(Work)
    private standsRepository: Repository<Work>,
  ) {}

  async create(work: Work): Promise<Work> {
    const partsInReached = { ...work, dateOfReport: new Date() };

    return this.standsRepository.save(partsInReached);
  }

  async findAll(): Promise<Work[]> {
    return this.standsRepository.find();
  }
}
