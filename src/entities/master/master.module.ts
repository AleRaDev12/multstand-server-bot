import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Master } from './master.entity';
import { MasterService } from './master.service';
import { MasterAddWizard } from './master-add.wizard';

@Module({
  imports: [TypeOrmModule.forFeature([Master])],
  providers: [MasterService, MasterAddWizard],
  exports: [MasterService],
})
export class MasterModule {}
