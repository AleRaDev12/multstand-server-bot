import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from '../../shared/interfaces';
import { MasterService } from '../master/master.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    @Inject(MasterService)
    private masterService: MasterService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.repository.find({ relations: ['master'] });
  }

  async findManagers(): Promise<User[]> {
    return this.repository.find({ where: { role: 'manager' } });
  }

  async createRequest(userId: number): Promise<User> {
    let user = await this.repository.findOne({
      where: { telegramUserId: userId },
    });
    if (!user) {
      user = this.repository.create({
        telegramUserId: userId,
        role: 'unregistered',
      });
      return this.repository.save(user);
    }
    return user;
  }

  async approveRequest(userId: number, name: string): Promise<void> {
    const user = await this.repository.findOne({ where: { id: userId } });
    if (user) {
      user.role = 'master';
      user.name = name;
      await this.repository.save(user);
      await this.masterService.createMaster(user, 1);
    }
  }

  async getRegistrationRequests(): Promise<User[]> {
    return this.repository.find({ where: { role: 'unregistered' } });
  }

  async findByTelegramId(telegramUserId: number): Promise<User> {
    return this.repository.findOne({ where: { telegramUserId } });
  }

  async getUserIdByTelegramId(telegramUserId: number): Promise<number> {
    const user = await this.repository.findOne({ where: { telegramUserId } });
    if (user) {
      return user.id;
    }
    return null;
  }

  async getRoleByTelegramUserId(telegramUserId: number): Promise<UserRole> {
    const user = await this.repository.findOne({ where: { telegramUserId } });
    if (
      user &&
      (user.role === 'master' ||
        user.role === 'manager' ||
        user.role === 'unregistered')
    ) {
      return user.role;
    }
    return 'unknown';
  }
}
