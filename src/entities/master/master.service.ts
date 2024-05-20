import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Master } from './master.entity';

@Injectable()
export class MasterService {
  constructor(
    @InjectRepository(Master)
    private repository: Repository<Master>,
  ) {}

  async create(master: Master): Promise<Master> {
    return this.repository.save(master);
  }

  async findAll(): Promise<Master[]> {
    return this.repository.find();
  }
}
