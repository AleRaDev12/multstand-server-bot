import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderService } from '../../orders/order/order.service';
import { Transaction } from './transaction.entity';
import { AccountService } from '../account/account.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
    private readonly orderService: OrderService,
    private readonly accountService: AccountService,
  ) {}

  async create(money: Transaction): Promise<Transaction> {
    const newMoney = await this.repository.save(money);

    if (money.order) {
      await this.orderService.updateSendingDeadLineByPaymentDate(
        money.order.id,
        money.transactionDate,
      );
    }

    return newMoney;
  }

  async findAll(): Promise<Transaction[]> {
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
