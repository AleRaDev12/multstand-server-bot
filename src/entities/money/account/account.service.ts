import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly repository: Repository<Account>,
  ) {}

  async create(account: Account): Promise<Account> {
    return this.repository.save(account);
  }

  async findAll(): Promise<Account[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<Account> {
    return this.repository.findOne({ where: { id } });
  }

  async getAccountBalances(): Promise<{ [key: string]: number }> {
    const accounts = await this.repository.find({
      relations: ['transactions'],
    });
    const balances: { [key: string]: number } = {};

    for (const account of accounts) {
      const balance = account.transactions.reduce(
        (acc, transaction) => acc + transaction.amount,
        0,
      );
      balances[account.name] = balance;
    }

    return balances;
  }

  async getAccountBalancesList(): Promise<string> {
    const balances = await this.getAccountBalances();
    return Object.keys(balances)
      .map((key) => `${key}: ${balances[key]}`)
      .join('\n');
  }
}
