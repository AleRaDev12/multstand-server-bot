import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TasksAddWizard } from './tasksAdd.wizard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TaskService, TasksAddWizard],
  exports: [TaskService],
})
export class TasksModule {}
