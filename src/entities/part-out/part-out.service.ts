import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartOut } from './part-out.entity';

@Injectable()
export class PartOutService {
  constructor(
    @InjectRepository(PartOut)
    private standsRepository: Repository<PartOut>,
  ) {}

  async create(PartOut: PartOut): Promise<PartOut> {
    return this.standsRepository.save(PartOut);
  }

  async findAll(): Promise<PartOut[]> {
    return this.standsRepository.find();
  }
}
