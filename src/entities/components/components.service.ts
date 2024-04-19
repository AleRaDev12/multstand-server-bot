import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Component } from './component.entity';

@Injectable()
export class ComponentsService {
  constructor(
    @InjectRepository(Component)
    private componentsRepository: Repository<Component>,
  ) {}

  async create(component: Component): Promise<Component> {
    return this.componentsRepository.save(component);
  }

  async findAll(): Promise<Component[]> {
    return this.componentsRepository.find();
  }
}
