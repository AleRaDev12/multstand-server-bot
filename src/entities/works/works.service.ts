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

  async create(partIn: Work): Promise<Work> {
    return this.standsRepository.save(partIn);
  }

  async findAll(): Promise<Work[]> {
    return this.standsRepository.find();
  }
}
