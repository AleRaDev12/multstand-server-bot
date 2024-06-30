import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { MasterModule } from '../master/master.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MasterModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
