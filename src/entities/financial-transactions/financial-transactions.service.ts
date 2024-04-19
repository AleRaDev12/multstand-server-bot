import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialTransaction } from './financial-transaction.entity';

@Injectable()
export class FinancialTransactionsService {
  constructor(
    @InjectRepository(FinancialTransaction)
    private financialTransactionsRepository: Repository<FinancialTransaction>,
  ) {}

  async create(
    financialTransaction: FinancialTransaction,
  ): Promise<FinancialTransaction> {
    return this.financialTransactionsRepository.save(financialTransaction);
  }

  async findAll(): Promise<FinancialTransaction[]> {
    return this.financialTransactionsRepository.find({
      relations: ['order', 'componentPurchase', 'master'],
    });
  }
}
