import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandProd } from './stand-prod.entity';

@Injectable()
export class StandProdService {
  constructor(
    @InjectRepository(StandProd)
    private standsRepository: Repository<StandProd>,
  ) {}

  async create(stand: StandProd): Promise<StandProd> {
    return this.standsRepository.save(stand);
  }

  async findAll(): Promise<StandProd[]> {
    return this.standsRepository.find();
  }
}
