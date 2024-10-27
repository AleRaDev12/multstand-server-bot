import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { UserRole } from '../../../shared/types';
import { LabelType } from '../../base.entity';
import { formatTask } from './task-formatting';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly repository: Repository<Task>,
  ) {}

  async create(task: Task): Promise<Task> {
    return this.repository.save(task);
  }

  async findById(id: number): Promise<Task> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByIdWithComponents(id: number): Promise<Task> {
    return this.repository.findOne({
      where: { id },
      relations: ['components'],
    });
  }

  async findAll(): Promise<Task[]> {
    return this.repository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async findAllWithComponents(): Promise<Task[]> {
    return this.repository.find({
      relations: ['components'],
      order: {
        name: 'ASC',
      },
    });
  }

  async taskWithComponentsFormatted(
    userRole: UserRole,
    type: LabelType,
  ): Promise<string[] | null> {
    const tasks = await this.findAllWithComponents();
    if (!this.hasItems(tasks)) {
      return null;
    }
    return this.formatList(tasks, userRole, type);
  }

  async update(task: Task): Promise<Task> {
    return this.repository.save(task);
  }

  async updateComponents(task: Task): Promise<Task> {
    const found = await this.findByIdWithComponents(task.id);
    found.components = task.components;
    return this.repository.save(found);
  }

  async getFormattedList(
    userRole: UserRole,
    type?: LabelType,
  ): Promise<string[] | null> {
    const items = await this.findAll();

    if (!this.hasItems(items)) {
      return null;
    }

    return this.formatList(items, userRole, type);
  }

  private hasItems(items: any[]): boolean {
    return items.length > 0;
  }

  private formatList(
    tasks: Task[],
    userRole: UserRole,
    type?: LabelType,
  ): string[] {
    return tasks.map((task) => this.format(task, userRole, type));
  }

  private format(task: Task, userRole: UserRole, type?: LabelType): string {
    return formatTask(task, userRole, type);
  }
}
