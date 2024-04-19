import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Master } from './master.entity';
import { MastersService } from './masters.service';
import { MastersAddWizard } from './masters-add.wizard';

@Module({
  imports: [TypeOrmModule.forFeature([Master])],
  providers: [MastersService, MastersAddWizard],
  exports: [MastersService],
})
export class MastersModule {}
