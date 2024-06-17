import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Component } from './component.entity';

@Injectable()
export class ComponentService {
  constructor(
    @InjectRepository(Component)
    private repository: Repository<Component>,
  ) {}

  async create(component: Component): Promise<Component> {
    return this.repository.save(component);
  }

  async findAll(): Promise<Component[]> {
    return this.repository.find();
  }

  async getList(): Promise<string | null> {
    const list = await this.findAll();
    if (list.length === 0) return null;
    return `${list.map((item, i) => `\n${i + 1}. ${item.name} ${item.type}`)}`;
  }
}
