import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private standsRepository: Repository<Task>,
  ) {}

  async create(task: Task): Promise<Task> {
    return this.standsRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.standsRepository.find();
  }

  async getList(): Promise<string> {
    const tasks = await this.findAll();
    return `${tasks.map((task, i) => `\n${i + 1}. ${task.category} ${task.taskName} ${task.duration}m ${task.cost}rub`)}`;
  }
}
