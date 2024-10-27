import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ComponentModule } from '../../parts/component/component.module';
import { TaskComponentLinkAddWizard } from './task-component-link/task-component-link-add.wizard';
import { TaskComponentListScene } from './task-component-link/task-component-list.scene';
import { TaskAddWizard } from './task-add/task-add.wizard';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), ComponentModule],
  providers: [
    TaskService,
    TaskAddWizard,
    TaskComponentLinkAddWizard,
    TaskComponentListScene,
  ],
  exports: [TaskService],
})
export class TaskModule {}
