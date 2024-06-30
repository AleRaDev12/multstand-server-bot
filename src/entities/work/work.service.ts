import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Work } from './work.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class WorkService {
  constructor(
    @InjectRepository(Work)
    private repository: Repository<Work>,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async create(work: Work): Promise<Work> {
    const newWork = {
      ...work,
      createdAt: new Date(),
    };

    console.log('Creating new work entry:', newWork);

    return this.repository.save(newWork);
  }

  async findAll(): Promise<Work[]> {
    return this.repository.find({ relations: ['standProd'] });
  }

  async getList(): Promise<string | null> {
    const list = await this.findAll();
    if (list.length === 0) return null;
    return list
      .map(
        (item, i) => `
${i + 1}. ${item.count} units
StandProds: ${item.standProd.map((sp) => sp.description).join(', ')}`,
      )
      .join('\n\n');
  }

  async findAllByUserId(userId: number): Promise<Work[]> {
    return this.repository.find({
      where: { master: { id: userId } },
      relations: ['task', 'standProd', 'standProd.standOrder'],
    });
  }
}
