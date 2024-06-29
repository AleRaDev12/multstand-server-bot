import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from '../../shared/interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

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

  async approveRequest(userId: number): Promise<void> {
    const user = await this.repository.findOne({ where: { id: userId } });
    if (user) {
      user.role = 'master';
      await this.repository.save(user);
    }
  }

  async getRegistrationRequests(): Promise<User[]> {
    return this.repository.find({ where: { role: 'unregistered' } });
  }

  async findByTelegramId(telegramUserId: number): Promise<User> {
    return this.repository.findOne({ where: { telegramUserId } });
  }

  async getRoleByUserId(telegramUserId: number): Promise<UserRole> {
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
