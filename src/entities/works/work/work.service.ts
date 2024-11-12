import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Work } from './work.entity';
import { Master } from '../../master/master.entity';
import { Transaction } from '../../money/transaction/transaction.entity';
import { StandProd } from '../../parts/stand-prod/stand-prod.entity';

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
    @InjectRepository(StandProd)
    private standProdRepository: Repository<StandProd>,
  ) {}

  async create(work: Work): Promise<Work> {
    const newWork = this.repository.create({
      ...work,
      createdAt: new Date(),
    });
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
${i + 1}. ${item.count} standProd: ${item.standProd.description}`,
      )
      .join('\n\n');
  }

  async findAllByUserId(userId: number): Promise<Work[]> {
    return this.repository.find({
      where: { master: { user: { id: userId } } },
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

  async getWorksForStandProd(standProdId: number): Promise<Work[]> {
    return this.repository.find({
      where: { standProd: { id: standProdId } },
      relations: [
        'task',
        'master',
        'master.user',
        'standProd',
        'standProd.standOrder',
      ],
    });
  }

  async calculateWorkCostForStandProd(standProdId: number): Promise<number> {
    const works = await this.repository.find({
      where: { standProd: { id: standProdId } },
    });

    return works.reduce((total, work) => {
      const workCost = work.cost * work.count * work.paymentCoefficient;
      return total + workCost;
    }, 0);
  }

  async getWorksByMaster(userId: number): Promise<Work[]> {
    return this.repository.find({
      where: { master: { user: { id: userId } } },
      relations: [
        'task',
        'standProd',
        'standProd.standOrder',
        'standProd.standOrder.order',
      ],
    });
  }

  async findWorksByStandOrderId(standOrderId: number): Promise<Work[]> {
    // Сначала найдем все StandProd, связанные с данным StandOrder
    const standProds = await this.standProdRepository.find({
      where: { standOrder: { id: standOrderId } },
      relations: ['work'],
    });

    // Соберем все уникальные ID работ
    const workIds = new Set<number>();
    standProds.forEach((standProd) => {
      standProd.work.forEach((work) => workIds.add(work.id));
    });

    // Если нет связанных работ, вернем пустой массив
    if (workIds.size === 0) {
      return [];
    }

    // Теперь найдем все эти работы с нужными связями
    return this.repository.find({
      where: { id: In(Array.from(workIds)) },
      relations: ['task', 'master'],
      order: { date: 'ASC' },
    });
  }

  // Obsolete
  async getStandProdsForWork(workId: number): Promise<StandProd> {
    const work = await this.repository.findOne({
      where: { id: workId },
      relations: ['standProd'],
    });

    return work?.standProd;
  }
}
