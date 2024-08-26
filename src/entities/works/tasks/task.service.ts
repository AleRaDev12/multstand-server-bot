import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private repository: Repository<Task>,
  ) {}

  async create(task: Task): Promise<Task> {
    return this.repository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.repository.find();
  }

  async getList(): Promise<string[] | null> {
    const list = await this.findAll();
    if (list.length === 0) return null;

    return list
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map(
        (task, i) =>
          `\n${i + 1}. ${task.shownName} ${task.duration}m ${task.cost}rub`,
      );
  }
}
