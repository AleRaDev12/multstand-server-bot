import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/tasks/task.entity';
import { seedTasks } from './entities/tasks/task-seed';
import { Component } from './entities/component/component/component.entity';
import { seedComponents } from './entities/component/component/component-seed';

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
    // Добавление задач в базу данных, если они еще не добавлены
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
