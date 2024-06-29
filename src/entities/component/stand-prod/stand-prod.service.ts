import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../../user/user.service';
import { StandProd } from './stand-prod.entity';
import { UserRole } from '../../../shared/interfaces';

@Injectable()
export class StandProdService {
  constructor(
    @InjectRepository(StandProd)
    private repository: Repository<StandProd>,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async create(standProd: StandProd): Promise<StandProd> {
    return this.repository.save(standProd);
  }

  async findAll(): Promise<StandProd[]> {
    return this.repository.find({
      relations: ['standOrder', 'works', 'standOrder.order'],
    });
  }

  async findNotLinked(): Promise<StandProd[]> {
    return this.repository.find({
      where: {
        standOrder: null,
      },
      relations: ['standOrder', 'works', 'standOrder.order'],
    });
  }

  async formatSingle(standProd: StandProd, userId: number): Promise<string> {
    return this.formatSingleWithRole(
      standProd,
      await this.userService.getRoleByUserId(userId),
    );
  }

  async formatList(standProds: StandProd[], userId: number): Promise<string[]> {
    if (standProds.length === 0) return null;

    const userRole = await this.userService.getRoleByUserId(userId);

    const formattedProds = [];
    let index = 1;
    for (const standProd of standProds) {
      const formattedProd = this.formatSingleWithRole(standProd, userRole);
      formattedProds.push(`\n№${index}\n${formattedProd}`);
      index++;
    }

    return formattedProds;
  }

  private formatSingleWithRole(
    standProd: StandProd,
    userRole: UserRole,
  ): string {
    const orderStateText = standProd?.standOrder?.order
      ? `💼 Статус заказа: ${standProd?.standOrder?.order?.status}`
      : '💼 Заказ: -';
    return `${standProd.format(userRole)}\n\n${orderStateText}\n\n🛠 Станок-заказ:\n${standProd.standOrder?.format(userRole) || '-'}`;
  }
}
