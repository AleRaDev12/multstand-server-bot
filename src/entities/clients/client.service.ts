import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private repository: Repository<Client>,
  ) {}

  async create(user: Client): Promise<Client> {
    return this.repository.save(user);
  }

  async findAll(): Promise<Client[]> {
    return this.repository.find();
  }

  async getList(): Promise<string> {
    const clients = await this.findAll();
    return `${clients.map((client, i) => `\n${i + 1}. ${client.id} ${client.firstName} ${client.lastName} ${client.city} ${client.phoneNumber}`)}`;
  }
}
