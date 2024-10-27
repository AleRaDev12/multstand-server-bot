import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartIn } from './part-in.entity';
import { UserRole } from '../../../shared/types';
import { UserService } from '../../user/user.service';

@Injectable()
export class PartInService {
  constructor(
    @InjectRepository(PartIn)
    private repository: Repository<PartIn>,

    @Inject(UserService)
    private userService: UserService,
  ) {}

  async create(partIn: PartIn): Promise<PartIn> {
    return this.repository.save(partIn);
  }

  async findAll(): Promise<PartIn[]> {
    return this.repository.find({ relations: ['component'] });
  }

  async getFormattedList(userRole: UserRole): Promise<string[] | null> {
    const list = await this.findAll();
    if (list.length === 0) return null;

    return this.formatList(list, userRole);
  }

  async formatList(partsIn: PartIn[], userRole: UserRole): Promise<string[]> {
    if (partsIn.length === 0) return null;

    const formattedList = [];
    let index = 1;
    for (const item of partsIn) {
      const formatted = this.formatSingleWithRole(item, userRole);
      formattedList.push(`\n№${index}\n${formatted}`);
      index++;
    }

    return formattedList;
  }

  private formatSingleWithRole(partIn: PartIn, userRole: UserRole): string {
    return `${partIn.component.format(userRole)}\n${partIn.format()}`;
  }
}
