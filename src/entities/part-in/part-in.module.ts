import { PartIn } from './part-in.entity';
import { PartInService } from './part-in.service';
import { PartInAddWizard } from './part-in-add.wizard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([PartIn])],
  providers: [PartInService, PartInAddWizard],
  exports: [PartInService],
})
export class PartInModule {}
