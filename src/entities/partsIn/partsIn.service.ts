import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartIn } from './partIn.entity';

@Injectable()
export class PartsInService {
  constructor(
    @InjectRepository(PartIn)
    private standsRepository: Repository<PartIn>,
  ) {}

  async create(partIn: PartIn): Promise<PartIn> {
    return this.standsRepository.save(partIn);
  }

  async findAll(): Promise<PartIn[]> {
    return this.standsRepository.find();
  }
}
