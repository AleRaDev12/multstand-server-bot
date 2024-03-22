import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stand } from './stand.entity';

@Injectable()
export class StandsService {
  constructor(
    @InjectRepository(Stand)
    private standsRepository: Repository<Stand>,
  ) {}

  async create(stand: Stand): Promise<Stand> {
    return this.standsRepository.save(stand);
  }

  async findAll(): Promise<Stand[]> {
    return this.standsRepository.find();
  }
}
