import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TaskAddWizard } from './task-add-wizard';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TaskService, TaskAddWizard],
  exports: [TaskService],
})
export class TaskModule {}
