import { PartIn } from './partsIn.entity';
import { PartsInService } from './partsIn.service';
import { PartsInAddWizard } from './partsInAdd.wizard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([PartIn])],
  providers: [PartsInService, PartsInAddWizard],
  exports: [PartsInService],
})
export class PartsInModule {}
