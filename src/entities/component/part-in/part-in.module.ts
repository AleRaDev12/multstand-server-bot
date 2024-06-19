import { PartIn } from './part-in.entity';
import { PartInService } from './part-in.service';
import { PartInAddWizard } from './part-in-add.wizard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ComponentModule } from '../component/component.module';
import { TransactionModule } from '../../money/transaction/transaction.module';
import { PartInListScene } from './part-in-list.scene';

@Module({
  imports: [
    TypeOrmModule.forFeature([PartIn]),
    ComponentModule,
    TransactionModule,
  ],
  providers: [PartInService, PartInAddWizard, PartInListScene],
  exports: [PartInService],
})
export class PartInModule {}
