import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandOrder } from './stand-order.entity';
import { StandOrderStatus, StandOrderStatusKeyType } from './stand-order-types';
import { formatLabels } from '../../../shared/helpers';
import { UserService } from '../../user/user.service';
import { UserRole } from '../../../shared/interfaces';

@Injectable()
export class StandOrderService {
  constructor(
    @InjectRepository(StandOrder)
    private readonly repository: Repository<StandOrder>,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async create(standOrder: StandOrder): Promise<StandOrder> {
    if (!standOrder.status) {
      standOrder.status = StandOrderStatus.Preliminary;
    }
    return this.repository.save(standOrder);
  }

  async findAll(): Promise<StandOrder[]> {
    return this.repository.find({ relations: ['order'] });
  }

  async findInProgress(): Promise<StandOrder[]> {
    const statusKey: StandOrderStatusKeyType = 'InProgress';
    return this.repository.find({
      where: {
        status: StandOrderStatus[statusKey],
      },
      relations: ['order'],
    });
  }

  async formatSingle(standOrder: StandOrder, userId: number): Promise<string> {
    return this.formatSingleWithRole(
      standOrder,
      await this.userService.getRoleByUserId(userId),
    );
  }

  async formatList(
    standOrders: StandOrder[],
    userId: number,
  ): Promise<string[]> {
    if (standOrders.length === 0) return null;

    const userRole = await this.userService.getRoleByUserId(userId);

    const formattedOrders = [];
    let index = 1;
    for (const standOrder of standOrders) {
      const formattedOrder = this.formatSingleWithRole(standOrder, userRole);
      formattedOrders.push(`\n№${index}.\n${formattedOrder}`);
      index++;
    }

    return formattedOrders;
  }

  private formatSingleWithRole(
    standOrder: StandOrder,
    userRole: UserRole,
  ): string {
    return `${standOrder.format(userRole)}\n-Заказ:\n${standOrder.order.format(userRole)}`;
  }
}
