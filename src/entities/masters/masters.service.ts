import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Master } from './master.entity';

@Injectable()
export class MastersService {
  constructor(
    @InjectRepository(Master)
    private mastersRepository: Repository<Master>,
  ) {}

  async create(master: Master): Promise<Master> {
    return this.mastersRepository.save(master);
  }

  async findAll(): Promise<Master[]> {
    return this.mastersRepository.find();
  }
}
