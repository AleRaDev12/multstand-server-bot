import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Money } from './money.entity';
import { addDays } from 'date-fns';
import { OrderService } from '../orders/order/order.service';

@Injectable()
export class MoneyService {
  constructor(
    @InjectRepository(Money)
    private readonly repository: Repository<Money>,
    private readonly orderService: OrderService,
  ) {}

  async create(money: Money): Promise<Money> {
    const newMoney = await this.repository.save(money);

    if (money.order) {
      await this.orderService.updateSendingDeadLineByPaymentDate(
        money.order.id,
        money.transactionDate,
      );
    }

    return newMoney;
  }

  async findAll(): Promise<Money[]> {
    return this.repository.find({
      relations: ['order', 'partIn', 'master'],
    });
  }

  async getBalance(): Promise<number> {
    const transactions = await this.findAll();
    return transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0,
    );
  }
}
