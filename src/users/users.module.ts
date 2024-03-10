import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { AddUserWizard } from './wizards/add-user.wizard';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, AddUserWizard],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
