import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartIn } from './partsIn.entity';

@Injectable()
export class PartsInService {
  constructor(
    @InjectRepository(PartIn)
    private standsRepository: Repository<PartIn>,
  ) {}

  async create(stand: PartIn): Promise<PartIn> {
    return this.standsRepository.save(stand);
  }

  async findAll(): Promise<PartIn[]> {
    return this.standsRepository.find();
  }
}
