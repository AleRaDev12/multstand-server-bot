import { PartIn } from './part-in.entity';
import { PartInService } from './part-in.service';
import { PartInAddWizard } from './part-in-add.wizard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ComponentModule } from '../component/component.module';

@Module({
  imports: [TypeOrmModule.forFeature([PartIn]), ComponentModule],
  providers: [PartInService, PartInAddWizard],
  exports: [PartInService],
})
export class PartInModule {}
