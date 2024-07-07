import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderService } from '../../orders/order/order.service';
import { Transaction } from './transaction.entity';
import { UserRole } from '../../../shared/interfaces';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
    private readonly orderService: OrderService,
  ) {}

  async create(transaction: Transaction): Promise<Transaction> {
    const newTransaction = await this.repository.save(transaction);

    if (transaction.order) {
      await this.orderService.updateSendingDeadLineByPaymentDate(
        transaction.order.id,
        transaction.transactionDate,
      );
    }

    return newTransaction;
  }

  async findAll(): Promise<Transaction[]> {
    return this.repository.find({
      relations: ['order', 'partIn', 'master'],
      order: { transactionDate: 'ASC' },
    });
  }

  async formatList(list: Transaction[], userRole: UserRole): Promise<string[]> {
    const formattedList: string[] = [];

    for (const standProd of list) {
      const formatted = await this.formatSingleWithRole(standProd, userRole);
      formattedList.push(formatted);
    }

    return formattedList;
  }

  private async formatSingleWithRole(
    transaction: Transaction,
    userRole: UserRole,
  ): Promise<string> {
    if (userRole !== 'manager') {
      return 'none';
    }

    const description = transaction.description
      ? transaction.description
      : 'Без описания';

    return `${transaction.transactionDate}\n${description}\nСумма: ${transaction.amount}`;
  }

  async getBalance(): Promise<number> {
    const transactions = await this.findAll();
    return transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0,
    );
  }
}
