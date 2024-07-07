import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { Transaction } from '../transaction/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';
import { UserRole } from '../../../shared/interfaces';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly repository: Repository<Account>,
    private readonly transactionService: TransactionService,
  ) {}

  async create(account: Account): Promise<Account> {
    return this.repository.save(account);
  }

  async findAll(): Promise<Account[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<Account> {
    return this.repository.findOne({
      where: { id },
      relations: ['transactions'],
    });
  }

  async getAccountBalances(): Promise<{ [key: string]: number }> {
    // TODO: Rewrite to get balances from query
    const accounts = await this.repository.find({
      relations: ['transactions'],
    });
    const balances: { [key: string]: number } = {};
    let totalBalance = 0;

    for (const account of accounts) {
      const balance = account.transactions.reduce(
        (acc, transaction) => acc + transaction.amount,
        0,
      );
      balances[account.name] = balance;
      totalBalance += balance;
    }

    balances['Сумма'] = totalBalance;

    return balances;
  }

  async getAccountBalancesList(): Promise<string[]> {
    const balances = await this.getAccountBalances();
    return Object.keys(balances).map(
      (key) => `${key}: ${balances[key].toFixed(2)}`,
    );
  }

  async transferMoney(params: {
    fromAccountId: number;
    toAccountId: number;
    amount: number;
    date: Date;
    description: string;
  }): Promise<void> {
    const { fromAccountId, toAccountId, amount, date, description } = params;
    const fromAccount = await this.findOne(fromAccountId);
    const toAccount = await this.findOne(toAccountId);

    if (!fromAccount || !toAccount) {
      throw new Error('One or both accounts not found');
    }

    const fromAccountBalance = fromAccount.transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0,
    );
    if (fromAccountBalance < amount) {
      throw new Error('Insufficient funds');
    }

    // Debit from the source account
    const debitTransaction = new Transaction();
    debitTransaction.account = fromAccount;
    debitTransaction.amount = -amount;
    debitTransaction.transactionDate = date;
    debitTransaction.description = `-> "${toAccount.name}": ${description ?? ''}`;
    await this.transactionService.create(debitTransaction);

    // Credit to the destination account
    const creditTransaction = new Transaction();
    creditTransaction.account = toAccount;
    creditTransaction.amount = amount;
    creditTransaction.transactionDate = date;
    creditTransaction.description = `<- ${fromAccount.name}: ${description ?? ''}`;
    await this.transactionService.create(creditTransaction);
  }

  async formatList(accounts: Account[]): Promise<string[]> {
    if (accounts.length === 0) return null;

    const formattedOrders = [];
    for (const account of accounts) {
      const formattedAccount = this.formatSingleWithRole(account, 'manager');
      formattedOrders.push(formattedAccount);
    }

    return formattedOrders;
  }

  private formatSingleWithRole(account: Account, userRole: UserRole): string {
    return `${account.format(userRole)}\n`;
  }
}
