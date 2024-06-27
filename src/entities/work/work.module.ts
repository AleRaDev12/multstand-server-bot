import { Work } from './work.entity';
import { WorkService } from './work.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TaskModule } from '../tasks/task.module';
import { WorkAddWizard } from './work-add.wizard';
import { ComponentModule } from '../component/component/component.module';
import { StandProdModule } from '../component/stand-prod/stand-prod.module';
import { MasterModule } from '../master/master.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Work]),
    ComponentModule,
    TaskModule,
    StandProdModule,
    MasterModule,
  ],
  providers: [WorkService, WorkAddWizard],
})
export class WorkModule {}
