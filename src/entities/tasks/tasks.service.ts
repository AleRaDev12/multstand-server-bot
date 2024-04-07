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
}
