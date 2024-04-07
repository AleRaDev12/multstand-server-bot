import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { TasksAddWizard } from './tasksAdd.wizard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TasksService, TasksAddWizard],
  exports: [TasksService],
})
export class TasksModule {}
