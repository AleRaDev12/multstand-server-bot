import { Work } from './work.entity';
import { WorkService } from './work.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TasksModule } from '../tasks/tasks.module';
import { WorkAddWizard } from './work-add.wizard';
import { StandProdModule } from '../stand/stand-prod/stand-prod.module';
import { ComponentModule } from '../component/component/component.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Work]),
    ComponentModule,
    TasksModule,
    StandProdModule,
  ],
  providers: [WorkService, WorkAddWizard],
})
export class WorkModule {}
