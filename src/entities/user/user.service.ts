import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async createRequest(userId: number, username: string): Promise<User> {
    console.log('*-* userId', userId);
    console.log('*-* username', username);

    let user = await this.repository.findOne({
      where: { telegramUserId: userId },
    });
    console.log('*-* user', user);
    if (!user) {
      user = this.repository.create({
        telegramUserId: userId,
        username,
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

  async findOneById(telegramUserId: number): Promise<User> {
    return this.repository.findOne({ where: { telegramUserId } });
  }
}
