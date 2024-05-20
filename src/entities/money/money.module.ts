import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Money } from './money.entity';
import { MoneyService } from './money.service';
import { MoneyAddWizard } from './money-add.wizard';

@Module({
  imports: [TypeOrmModule.forFeature([Money])],
  providers: [MoneyService, MoneyAddWizard],
  exports: [MoneyService],
})
export class MoneyModule {}
