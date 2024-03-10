import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(user: Client): Promise<Client> {
    return this.clientsRepository.save(user);
  }

  async findAll(): Promise<Client[]> {
    return this.clientsRepository.find();
  }
}
