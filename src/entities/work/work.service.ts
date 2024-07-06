import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Work } from './work.entity';
import { Master } from '../master/master.entity';
import { Transaction } from '../money/transaction/transaction.entity';

interface Earnings {
  totalEarned: number;
  alreadyPaid: number;
  toPay: number;
}

@Injectable()
export class WorkService {
  constructor(
    @InjectRepository(Work)
    private repository: Repository<Work>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Master)
    private masterRepository: Repository<Master>,
  ) {}

  async create(work: Work): Promise<Work> {
    const newWork = {
      ...work,
      createdAt: new Date(),
    };
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

  async calculateEarnings(userId: number): Promise<Earnings> {
    const works = await this.findAllByUserId(userId);
    const master = await this.masterRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!master) {
      throw new Error('Master not found for this user');
    }

    const totalEarned = works.reduce(
      (sum, work) => sum + work.cost * work.count * work.paymentCoefficient,
      0,
    );

    const transactions = await this.transactionRepository.find({
      where: { master: { id: master.id } },
    });

    const alreadyPaid = transactions.reduce((sum, transaction) => {
      // Отрицательные значения - это выплаты мастеру
      return sum + (transaction.amount < 0 ? -transaction.amount : 0);
    }, 0);

    const toPay = totalEarned - alreadyPaid;

    return {
      totalEarned,
      alreadyPaid,
      toPay,
    };
  }

  async getTransactionHistory(userId: number): Promise<Transaction[]> {
    const master = await this.masterRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!master) {
      throw new Error('Master not found for this user');
    }

    return this.transactionRepository.find({
      where: { master: { id: master.id } },
      order: { transactionDate: 'DESC' },
    });
  }
}
