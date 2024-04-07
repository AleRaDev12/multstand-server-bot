import { Work } from './work.entity';
import { WorksService } from './works.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TasksModule } from '../tasks/tasks.module';
import { WorksAddWizard } from './worksAdd.wizard';

@Module({
  imports: [TypeOrmModule.forFeature([Work]), TasksModule],
  providers: [WorksService, WorksAddWizard],
})
export class WorksModule {}
