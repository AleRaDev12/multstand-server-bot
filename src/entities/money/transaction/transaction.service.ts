import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderService } from '../../orders/order/order.service';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
    private readonly orderService: OrderService,
  ) {}

  async create(transaction: Transaction): Promise<Transaction> {
    const newTransaction = await this.repository.save(transaction);

    console.log('*-* newTransaction', newTransaction);

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
    });
  }

  // *-*

  async getBalance(): Promise<number> {
    const transactions = await this.findAll();
    return transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0,
    );
  }
}
