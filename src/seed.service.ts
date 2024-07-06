import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/works/tasks/task.entity';
import { seedTasks } from './entities/works/tasks/task-seed';
import { Component } from './entities/parts/component/component.entity';
import { seedComponents } from './entities/parts/component/component-seed';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Component)
    private componentRepository: Repository<Component>,
  ) {}

  async onModuleInit() {
    await this.seedTasks();
  }

  private async seedTasks() {
    for (const task of seedTasks) {
      const dbTask = await this.taskRepository.findOneBy({
        name: task.name,
      });
      if (!dbTask) {
        await this.taskRepository.save(task);
      }
    }
    for (const component of seedComponents) {
      const dbComponent = await this.componentRepository.findOneBy({
        name: component.name,
      });
      if (!dbComponent) {
        await this.componentRepository.save(component);
      }
    }

    console.log('Seeding tasks completed');
  }
}
