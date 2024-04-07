import { StandSet } from './standSet.entity';
import { StandSetsService } from './standSets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([StandSet])],
  providers: [StandSetsService /*WorksAddWizard*/],
  exports: [StandSetsService],
})
export class StandSetsModule {}
