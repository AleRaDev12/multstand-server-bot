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

  async create(client: Client): Promise<Client> {
    return this.repository.save(client);
  }

  async findOne(id: number): Promise<Client> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<Client[]> {
    return this.repository.find();
  }

  async getList(): Promise<string | null> {
    const list = await this.findAll();
    if (list.length === 0) return null;

    return `${list.map((client, i) => `\n${i + 1}. #${client.id} ${client.firstName} ${client.lastName} ${client.city} ${client.phoneNumber} ${client.email} ${client.organization} ${client.description}\n`)}`;
  }
}
