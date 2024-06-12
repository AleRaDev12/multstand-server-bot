import { PartOut } from './part-out.entity';
import { PartOutService } from './part-out.service';
import { PartOutAddWizard } from './part-out-add.wizard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PartOutListScene } from './part-out-list.scene';

@Module({
  imports: [TypeOrmModule.forFeature([PartOut])],
  providers: [PartOutService, PartOutAddWizard, PartOutListScene],
  exports: [PartOutService],
})
export class PartOutModule {}
