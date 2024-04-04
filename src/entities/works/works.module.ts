import { Work } from './work.entity';
import { WorksService } from './works.service';
import { WorksAddWizard } from './worksAdd.wizard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Work])],
  providers: [WorksService, WorksAddWizard],
  exports: [WorksService],
})
export class WorksModule {}
